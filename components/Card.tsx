import Image from 'next/image'
import Link from 'next/link'
import styles from '@/components/Card.module.css'
import cls from 'classnames'


type CardProps = {
  name: string,
  imageUrl: string,
  href: string
}

const Card = ({name, imageUrl, href}: CardProps) => {
  return (
    <Link href={href} className={styles.cardLink}>
      <div className={cls('glass', styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image className={styles.cardImage} src={imageUrl} height={160} width={260} alt={imageUrl}/>
        </div>
      </div>
    </Link>
  )
}

export default Card
