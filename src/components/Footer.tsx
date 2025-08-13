import React from 'react'
import Image from 'next/image'
const Footer = () => {
    return (
        <footer className="mt-40 bg-pink-800 text-white dark:bg-pink-800 py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <Image src='/logo-footer.png' className='rounded-full ' alt='logo' width={100} height={50}/>
                    <b>Everything is up to work</b>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">О нас</h2>
                    <p className="text-sm opacity-90">
                        компания-разработчик программного обеспечения для управления проектами, которая предоставляет универсальную платформу для повышения эффективности рабочего места и совместной работы.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Навигация</h2>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li><a href="#" className="hover:underline">Главная</a></li>
                        <li><a href="/sign-up" className="hover:underline">Зарегистрироваться</a></li>
                        <li><a href="#" className="hover:underline">Отзывы</a></li>
                        <li><a href="#" className="hover:underline">Контакты</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Контакты</h2>
                    <ul className="text-sm opacity-90 space-y-2">
                        <li>📞 +7 (999) 123-45-67</li>
                        <li>📧 info@startup.com</li>
                        <li>🏢 Томск, ул. Ленина, 122</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm opacity-80">
                © {new Date().getFullYear()} ClickUp. Все права защищены.
            </div>
        </footer>
    )
}
export default Footer
