import type { IFont, IPoint } from './types'

export function formatValue(val: string | number) {
  return typeof val === 'string' ? val : `${val}px`
}

/**
 * 创造 [CSS-font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 字符串
 * 由于 canvas 绘制的差异性部分属性不生效故舍弃
 */
export function createCanvasFontString({
  fontFamily,
  fontSize,
  fontStyle = 'normal',
  fontWeight = 'normal',
}: IFont): string {
  fontSize = typeof fontSize === 'string' ? fontSize : `${fontSize}px`
  return `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`
}

export function calcMin(numbers: number[]) {
  let min = numbers[0]
  for (let index = 0; index < numbers.length; index++) {
    const element = numbers[index]
    if (element < min) {
      min = element
    }
  }
  return min
}

export function calcMax(numbers: number[]) {
  let max = numbers[0]
  for (let index = 0; index < numbers.length; index++) {
    const element = numbers[index]
    if (element > max) {
      max = element
    }
  }
  return max
}

/**
 * 计算差异
 * @param numbers
 */
export function calcDiff(numbers: number[]) {
  return calcMax(numbers) - calcMin(numbers)
}

/**
 * 确保输入值在 min 和 max 之间，若超出边界则返回边界
 * @param input
 * @param min
 * @param max
 */
export function ensureBetween(input: number, min: number = 0, max: number = 1) {
  return input <= min ? min : input >= max ? max : input
}

export function calcCenter(num1: number, num2: number) {
  return (num1 + num2) / 2
}

export function toPoint(point: IPoint | number): IPoint {
  let x = 0
  let y = 0
  if (typeof point !== 'undefined') {
    if (typeof point === 'object') {
      x = point.x
      y = point.y
    }
    else {
      x = y = point
    }
  }
  return { x, y }
}

// 计算变换后的矩形实际大小
export function getTransformedRectSize(transform: [number, number, number, number, number, number], rect: { x: number, y: number, width: number, height: number }) {
  const [a, b, c, d, e, f] = transform
  const { x, y, width, height } = rect

  // 矩形四个角的坐标
  const corners: IPoint[] = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ]

  // 变换后的角点坐标
  const transformedCorners = corners.map(({ x: cx, y: cy }) => {
    return {
      x: a * cx + c * cy + e,
      y: b * cx + d * cy + f,
    }
  })

  // 计算变换后的矩形宽度和高度
  const xValues = transformedCorners.map(corner => corner.x)
  const yValues = transformedCorners.map(corner => corner.y)
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)

  return {
    width: maxX - minX,
    height: maxY - minY,
  }
}
