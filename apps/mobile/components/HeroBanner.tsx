import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'

const { width } = Dimensions.get('window')

const heroSlides = [
  require('@/assets/banner1.png'),
  require('@/assets/banner2.png'),
  require('@/assets/banner3.png'),
]

export function HeroBanner() {
  const flatListRef = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % heroSlides.length

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      })

      setCurrentIndex(nextIndex)
    }, 4500)

    return () => clearInterval(interval)
  }, [currentIndex])

  const scrollPrev = () => {
    const prevIndex =
      currentIndex === 0
        ? heroSlides.length - 1
        : currentIndex - 1

    flatListRef.current?.scrollToIndex({
      index: prevIndex,
      animated: true,
    })

    setCurrentIndex(prevIndex)
  }

  const scrollNext = () => {
    const nextIndex = (currentIndex + 1) % heroSlides.length

    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    })

    setCurrentIndex(nextIndex)
  }

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={scrollPrev}
        className="absolute left-3 top-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/50"
      >
        <ChevronLeft color="white" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={scrollNext}
        className="absolute right-3 top-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/50"
      >
        <ChevronRight color="white" size={20} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={heroSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          )
          setCurrentIndex(index)
        }}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{
              width: width - 32,
              height: 180,
              borderRadius: 24,
            }}
            resizeMode="cover"
          />
        )}
      />
    </View>
  )
}