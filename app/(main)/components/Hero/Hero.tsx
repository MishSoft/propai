import React from 'react'
import HeroCards from './HeroCards'

import { AiOutlineHome } from "react-icons/ai";
import { MdPeopleOutline } from "react-icons/md";
import { SiGooglegemini } from "react-icons/si";

export default function Hero() {
  return (
    <section className='my-10 grid md:grid-cols-2 xl:grid-cols-3 items-center gap-2'>
      <HeroCards title={'active listings'} icon={AiOutlineHome} number={24} increment={'+2 % vs last month'}/>
      <HeroCards title={'total buyers'} icon={MdPeopleOutline} number={142} increment={'-1 % vs last month'} />
      <HeroCards title={'pending descriptions'} icon={SiGooglegemini} number={5} increment={'+5 drafts today'} />
    </section>
  )
}
