"use client"

import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"
import { ReactNode, useState } from "react"
import { BookmarkIcon, ShareIcon } from "@heroicons/react/24/outline"

interface SwipeableResourceCardProps {
    children: ReactNode
    onBookmark?: () => void
    onShare?: () => void
}

export function SwipeableResourceCard({
    children,
    onBookmark,
    onShare
}: SwipeableResourceCardProps) {
    const [swiped, setSwiped] = useState<"left" | "right" | null>(null)

    const [{ x }, api] = useSpring(() => ({ x: 0 }))

    const bind = useDrag(({ down, movement: [mx], cancel }) => {
        // Threshold for triggering action
        const trigger = Math.abs(mx) > 100

        if (trigger && !down) {
            if (mx > 0 && onBookmark) {
                setSwiped("right")
                onBookmark()
                // Reset after delay
                setTimeout(() => {
                    api.start({ x: 0 })
                    setSwiped(null)
                }, 1000)
            } else if (mx < 0 && onShare) {
                setSwiped("left")
                onShare()
                setTimeout(() => {
                    api.start({ x: 0 })
                    setSwiped(null)
                }, 1000)
            } else {
                api.start({ x: 0 })
            }
        } else {
            api.start({ x: down ? mx : 0, immediate: down })
        }
    }, {
        axis: 'x',
        filterTaps: true,
    })

    return (
        <div className="relative touch-pan-y">
            {/* Background Actions */}
            <div className="absolute inset-0 flex items-center justify-between px-6 rounded-lg overflow-hidden">
                <div className={`flex items-center gap-2 text-primary-600 font-medium transition-opacity ${x.to(x => x > 50 ? 1 : 0)}`}>
                    <BookmarkIcon className="h-6 w-6" />
                    Bookmark
                </div>
                <div className={`flex items-center gap-2 text-blue-600 font-medium transition-opacity ${x.to(x => x < -50 ? 1 : 0)}`}>
                    Share
                    <ShareIcon className="h-6 w-6" />
                </div>
            </div>

            {/* Card Content */}
            <animated.div
                {...bind()}
                style={{ x, touchAction: 'pan-y' }}
                className="relative bg-white rounded-lg"
            >
                {children}
            </animated.div>
        </div>
    )
}
