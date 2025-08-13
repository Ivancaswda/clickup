'use client'
import React from 'react'
import { motion} from "motion/react";
import {AnimatedTooltip} from "@/components/ui/animated-tooltip";
import {AuroraBackground} from "@/components/ui/aurora-background";
import {ArrowBigDownDashIcon} from "lucide-react";
import {developers, trustedBrands} from "@/constants";
import AdCardsComponent from "@/components/AdCardsComponent";
import {AnimatedTestimonials} from "@/components/ui/animated-testimonials";
import {testimonials} from "@/constants";
import WobbleCards from "@/components/WobbleCards";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import {Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";
import Footer from "@/components/Footer";
import Link from 'next/link'
import {useCurrent} from "@/features/auth/api/use-current";
import {redirect} from "next/navigation";
const GlobalPage = () => {

    const {data: user} = useCurrent()

    if (user) redirect('/workspaces/create')



    return (
        <div>
            <AuroraBackground>
                <motion.div
                    initial={{opacity: 0.0, y: 40}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                        <span className='text-pink-500'>ClickUp</span> только для универсальной работы
                    </div>
                    <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 py-4">
                        Пусть ваша компания работает на одной платформе с множеством возможностей
                    </div>
                    <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                        <Link href='/sign-in'>
                            Начать сейчас
                        </Link>
                    </button>
                </motion.div>
            </AuroraBackground>
            <div className="flex flex-row mt-20 gap-10 items-center justify-center mb-10 w-full">
                <AnimatedTooltip items={developers}/>
            </div>
            <h2 className='text-center flex items-center justify-center mt-20 font-semibold text-2xl'>Бренды которые нам доверяют</h2>
            <div className="overflow-hidden whitespace-nowrap w-full mt-6 py-10 bg-white dark:bg-black">
                <div className="flex animate-scroll-x gap-10 w-max">
                    {[...trustedBrands, ...trustedBrands].map((brand) => (
                        <div key={brand.id + Math.random()}
                             className="flex items-center justify-center w-[120px] cursor-pointer h-20 px-4">
                            <img src={brand.logo} alt={brand.name}
                                 className="h-full object-contain grayscale hover:grayscale-0 transition duration-300"/>
                        </div>
                    ))}
                </div>
            </div>

            <AdCardsComponent/>

            <AnimatedTestimonials testimonials={testimonials}/>

            <WobbleCards/>


            <div className="relative mt-[200px] flex items-center justify-center flex-col">
                <h1 className='flex items-center justify-center gap-4 my-10 text-xl font-semibold'>Поймите как работает
                    наша система <ArrowBigDownDashIcon/></h1>

                <Tooltip>
                    <TooltipTrigger>
                        <HeroVideoDialog
                            className="hidden dark:block"
                            animationStyle="from-center"
                            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                            thumbnailAlt="Hero Video"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        Нажмите чтобы посмотреть видео о нас
                    </TooltipContent>
                </Tooltip>

            </div>

            <Footer/>
        </div>
    )
}
export default GlobalPage
