import { useRef, useEffect } from "react"
// @ts-ignore
import { gsap } from "gsap/dist/gsap.js"
// @ts-ignore
import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js"
import { useTranslation } from "react-i18next"

import { Button, Link } from "~/components/shared"
import PhoneFrame from "~/assets/phone-frame.svg"
import BotLogo from "~/assets/bot-logo.png"

export default function TelegramExample() {
  const { t } = useTranslation("home")

  const bubblesData = [
    {
      id: 1,
      text: `<span class=" font-semibold">/create</span>`,
      type: "human",
      bottom: "bottom-[380px]"
    },
    {
      id: 2,
      text: "Input your URL",
      type: "bot",
      bottom: "bottom-[280px]"
    },
    {
      id: 3,
      text: "my.long.url/that-is-very-long",
      type: "human",
      bottom: "bottom-[180px]"
    },
    {
      id: 4,
      text: `Your short link is:<br /><span class=" font-semibold">pndek.in/xxxxx</span>`,
      type: "bot",
      bottom: "bottom-[60px]"
    }
  ]

  const bubbleRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    bubbleRefs.current.forEach((bubble) => {
      if (bubble) {
        const isBot = bubble.getAttribute("data-type") === "bot"
        gsap.fromTo(
          bubble,
          { autoAlpha: 0, x: isBot ? -30 : 30, y: 0 }, // Starting state
          {
            autoAlpha: 1, // Fully opaque
            x: 0, // Original position on the x-axis
            y: 0, // Original position on the y-axis
            duration: 1, // Animation duration
            scrollTrigger: {
              trigger: bubble,
              start: "top bottom-=100",
              toggleActions: "play none none none"
            }
          }
        )
      }
    })
  }, [])

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !bubbleRefs.current.includes(el)) {
      bubbleRefs.current.push(el)
    }
  }

  const getBubbleStyle = (type: string) => {
    if (type === "bot") {
      return "left-6 md:left-8 bg-purple-500 text-white border-purple-600 rounded-tl-3xl rounded-br-3xl rounded-tr-3xl"
    } else {
      return "right-7 md:right-8 bg-green-500 text-white border-green-600 rounded-tr-3xl rounded-bl-3xl rounded-tl-3xl"
    }
  }

  return (
    <div className=" bg-white dark:bg-slate-200">
      <div className=" flex flex-col md:flex-row items-center p-5 mx-auto max-w-[900px] w-full py-20 md:py-10 space-x-0 md:space-x-16">
        <div className=" max-w-96">
          <div className=" bg-gradient-to-t from-teal-500 via-sky-600 to-sky-900 rounded-[60px] md:rounded-[80px] md:w-full w-[calc(100%-10px)]">
            <div className="relative">
              <div className="absolute bg-slate-500 rounded-t-[60px] md:rounded-t-[80px] top-0 w-full flex items-end h-24 md:h-28 px-7 md:px-10 py-3 md:py-4 shadow-md">
                <div className=" flex items-center gap-2">
                  <img
                    src={BotLogo}
                    alt="Bot Logo"
                    className=" w-7 h-7 rounded-full border"
                  />
                  <p className=" font-bold text-white">pndek.in Bot</p>
                </div>
              </div>
            </div>
            <div
              style={{ backgroundImage: `url(${PhoneFrame})` }}
              className="relative bg-contain bg-no-repeat bg-left w-[300px] h-[600px] sm:w-[384px] sm:h-[778px]"
            >
              {bubblesData.map((bubble) => (
                <div
                  key={bubble.id}
                  ref={addToRefs}
                  data-type={bubble.type}
                  className={`absolute px-4 py-2 border ${
                    bubble.bottom
                  } ${getBubbleStyle(bubble.type)}`}
                  dangerouslySetInnerHTML={{ __html: bubble.text }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className=" flex flex-col justify-center items-start mt-8 md:mt-0">
          <h2 className=" text-xl md:text-2xl font-semibold mb-2">
            {t("bot-preview-title")}
          </h2>
          <p className=" text-base mb-6">{t("bot-preview-desc")}</p>
          <Link to="https://t.me/pndekin_bot" target="_blank" className=" self-center md:self-start">
            <Button>{t("bot-preview-cta")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
