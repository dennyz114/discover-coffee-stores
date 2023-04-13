import Head from 'next/head'
import Image from 'next/image'
// import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner'
import Card from '@/components/Card'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import useGeolocation from '@/hooks/useGeolocation'
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '@/store/storeContext'

// const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: { coffeeStores }
  }
}

export default function Home({ coffeeStores }) {
  const {onGetLocation, locationErrorMsg, isFindingLocation} = useGeolocation()
  const [coffeeStoresError, setCoffeeStoresError] = useState('')
  const { dispatch, state } = useContext(StoreContext)
  const { latLong, nearbyStores } = state

  const handleOnBannerButtonClick = () => {
    onGetLocation()
  }

  useEffect(() => {
    const getNearCoffeeStores = async () => {
      try {
        const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`)
        const coffeeStores = await response.json()
        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: { nearbyStores: coffeeStores }
        })
      } catch(error) {
        setCoffeeStoresError(error.message)
      }
    }

    if (latLong) {
      void getNearCoffeeStores()
    }
  }, [latLong])

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnclick={handleOnBannerButtonClick}
        />
        <p>{locationErrorMsg && `Something went wrong ${locationErrorMsg}`}</p>
        <p>{coffeeStoresError && `Something went wrong ${coffeeStoresError}`}</p>
        <div className={styles.heroImage}>
          <Image src={'/static/hero-image.png'} width={700} height={400} alt={'hero-image'}/>
        </div>
        {
          nearbyStores.length > 0 &&
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {
                nearbyStores.map(({id, name, imgUrl}) => (
                  <Card
                    key={id}
                    name={name}
                    imageUrl={imgUrl}
                    href={`/coffee-store/${id}`}
                    className={styles.card}
                  />
                ))
              }
            </div>
          </div>
        }
        {
          coffeeStores.length > 0 &&
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Tomas Valle Coffee stores</h2>
            <div className={styles.cardLayout}>
              {
                coffeeStores.map(({id, name, imgUrl}) => (
                  <Card
                    key={id}
                    name={name}
                    imageUrl={imgUrl}
                    href={`/coffee-store/${id}`}
                    className={styles.card}
                  />
                ))
              }
            </div>
          </div>
        }
      </main>
    </>
  )
}
