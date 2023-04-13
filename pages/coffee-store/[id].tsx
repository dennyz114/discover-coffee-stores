import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import styles from '@/styles/coffee-store.module.css'
import Image from 'next/image'
import cls from 'classnames'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '@/store/storeContext'
import { isEmpty, fetcher } from '@/utils'
import useSWR from 'swr'

export async function getStaticProps({params}) {
  const coffeeStores = await fetchCoffeeStores()
  const coffeeStoreFound = coffeeStores.find(store => store.id.toString() === params.id)
  return {
    props: {
      coffeeStore: coffeeStoreFound || {}
    }
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()
  const paths = coffeeStores.map(cs => ({params: { id: cs.id.toString()}}))
  return {
    paths,
    fallback: true
  }
}

const CoffeeStore = ({coffeeStore: initialCoffeeStore}) => {
  const [coffeeStore, setCoffeeStore] = useState(initialCoffeeStore)
  const [voting, setVoting] = useState(0)
  const router = useRouter()
  const { id } = router.query
  const { state: { nearbyStores } } = useContext(StoreContext)

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const {id, name, address, neighbourhood, imgUrl} = coffeeStore || {}
      const data = {
        id,
        name,
        'address': address || '',
        'neighbourhood': neighbourhood || '',
        imgUrl,
        'voting': 0
      }
      await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }catch (e) {
      console.error('error creating coffee store', e)
    }
  }

  useEffect(() => {
    if (isEmpty(coffeeStore)) {
      if (nearbyStores.length > 0) {
        const foundFromContext = nearbyStores.find(store => store.id.toString() === id)
        if (foundFromContext) {
          setCoffeeStore(foundFromContext)
          handleCreateCoffeeStore(foundFromContext)
        }
      }
    } else {
      handleCreateCoffeeStore(coffeeStore)
    }
  }, [id, coffeeStore])


  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

  useEffect(() => {
    if (data && data.coffeeStore) {
      setCoffeeStore(data.coffeeStore)
      setVoting(data.coffeeStore.voting)
    }
  }, [data])

  if (error) {
    console.error('error fetching data', error)
  }

  if(router.isFallback)
    return <div>Loading...</div>

  const {neighbourhood, address, name = '', imgUrl} = coffeeStore || {}

  const handleUpVote = async () => {
    try {
      const response = await fetch ('/api/favoriteCoffeeStoreById', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id})
      })
      const dbCoffeeStore = await response.json()
      if (dbCoffeeStore) {
        setVoting(voting + 1)
      }
    } catch (e) {
      console.error('error updating coffee store', e)
    }
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <Link href={'/'} className={styles.backToHomeLink}>Back to home</Link>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          {imgUrl && <Image src={imgUrl} alt={name} className={styles.storeImg} width={600} height={360}/>}
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src={"/static/icons/places.svg"} width={24} height={24} alt={'places'}/>
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src={"/static/icons/nearMe.svg"} width={24} height={24} alt={'nearMe'}/>
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src={"/static/icons/star.svg"} width={24} height={24} alt={'star'}/>
            <p className={styles.text}>{voting}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpVote}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore
