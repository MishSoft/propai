import React from 'react'
import HeroCards from './HeroCards'

import { AiOutlineHome } from "react-icons/ai";
import { MdPeopleOutline } from "react-icons/md";
import { SiGooglegemini } from "react-icons/si";
import { FaBuilding } from 'react-icons/fa';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Hero() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const listingsCount = await db.post.count({
    where: { authorId: session.user.id }
  });
  return (
    <section className='my-10 grid md:grid-cols-2 xl:grid-cols-3 items-center gap-2'>
      <HeroCards
        title="Total Listings"
        icon={FaBuilding}
        number={listingsCount}
        increment="+2"
      />
    </section>
  )
}
