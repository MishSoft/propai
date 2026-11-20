import React from 'react'
import HeroCards from './HeroCards'
import { FaBuilding } from 'react-icons/fa';
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlinePriceChange } from "react-icons/md";


import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function Hero() {
  const t = await getTranslations('Dashboard');
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const listingsCount = await db.post.count({
    where: { authorId: userId }
  });

  const buyersCount = await db.buyer.count({
    where: { authorId: userId }
  });

  const totalPrice = await db.post.aggregate({
    where: { authorId: userId },
    _sum: {
      price: true
    }
  });

  const totalNumber = Number(totalPrice?._sum.price || 0)

  return (
    <section className='my-10 grid md:grid-cols-2 xl:grid-cols-3 items-center gap-6'>
      <HeroCards
        title={t('listingsCount')}
        icon={FaBuilding}
        number={listingsCount}
        increment="+2"
      />
      <HeroCards
        title={t('buyersCount')}
        icon={IoPeopleSharp}
        number={buyersCount}
        increment="+2"
      />
      <HeroCards
        title={t('total_value')}
        icon={MdOutlinePriceChange}
        increment="+2"
        priceValue={Math.round(totalNumber).toLocaleString() + "$"}
      />

    </section>
  )
}
