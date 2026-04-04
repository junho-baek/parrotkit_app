"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, type MotionProps, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
  reserveSpace?: boolean
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 18 },
    transition: { duration: 0.22, ease: "easeOut" },
  },
  className,
  reserveSpace = true,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const widestWordLength = useMemo(
    () => words.reduce((max, word) => Math.max(max, word.length), 0),
    [words]
  )

  useEffect(() => {
    if (shouldReduceMotion || words.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)

    return () => clearInterval(interval)
  }, [words, duration, shouldReduceMotion])

  return (
    <span
      className="relative inline-flex min-h-[1.15em] overflow-hidden align-baseline"
      style={reserveSpace ? { minWidth: `${Math.max(widestWordLength * 0.72, 6)}ch` } : undefined}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={words[index]}
          className={cn("inline-block whitespace-nowrap", className)}
          {...(shouldReduceMotion
            ? {}
            : motionProps)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
