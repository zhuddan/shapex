import type { Properties } from 'csstype'
import type { PointData } from '../coordinate/PointData'
import { ObservablePoint } from '../coordinate/ObservablePoint'
import { drawRectCompatible } from '../utils'
import type { App } from '../app'
import { IS_WX_UNIAPP } from '../const'
import type { RenderableOptions, ShadowType } from './renderable'
import { Renderable } from './renderable'

export interface PictureOptions extends RenderableOptions {
  /**
   *  image
   */
  image: HTMLImageElement | string
  /**
   * 图片的宽高
   */
  size?: PointData
  /**
   * 图片切片的开始坐标
   */
  slice?: PointData
  /**
   * 图片切片的宽高
   */
  sliceSize?: PointData
  /**
   * 图片的缩放模式
   */
  objectFit?: Properties['objectFit']
  /**
   * 圆角
   */
  rounded?: number
  /**
   * @deprecated 图片不支持阴影
   */
  shadow?: ShadowType
}

export class Picture extends Renderable {
  private src = ''
  constructor(private options?: PictureOptions) {
    super(options)
    const maybeImage = options?.image
    if (typeof maybeImage == 'string') {
      if (IS_WX_UNIAPP) {
        this.src = maybeImage
      }
      else {
        this.image = document.createElement('img')
        this.image.src = maybeImage
        this.initImageEvents()
      }
      this.rounded = this.options?.rounded ?? 0
    }
    else {
      this.image = maybeImage
      this.initImageEvents()
    }
  }

  onAdd(_app: App) {
    super.onAdd(_app)
    if (IS_WX_UNIAPP) {
      _app.onReady(this.createImage.bind(this))
    }
  }

  createImage() {
    if (!this._app)
      return
    this.image = (this._app?.canvas as any).createImage()
    this.image!.src = this.src
    this.initImageEvents()
  }

  initImageEvents() {
    if (!this.image)
      return
    if (this.image.complete) {
      this._onImageComplete()
    }
    else {
      this.image.addEventListener('load', () => {
        this._onImageComplete()
      })
    }
  }

  private image?: HTMLImageElement

  private _size = new ObservablePoint(this, 0, 0)

  private _imageSize = new ObservablePoint(this, 0, 0)

  set size(value: PointData) {
    if (this.size !== value && !this.size.equals(value)) {
      this._size.copyFrom(value)
      this.shouldUpdateBounds('size')
    }
  }

  get size(): ObservablePoint {
    return this._size
  }

  private _slice = new ObservablePoint(this)

  set slice(value: PointData) {
    if (this.slice !== value) {
      this._slice.copyFrom(value)
      this.shouldUpdateBounds('slice')
    }
  }

  get slice(): ObservablePoint {
    return this._slice
  }

  private _sliceSize = new ObservablePoint(this)

  set sliceSize(value: PointData) {
    if (this.sliceSize !== value) {
      this._sliceSize.copyFrom(value)
      this._onUpdate()
      this.shouldUpdateBounds('sliceSize')
    }
  }

  get sliceSize(): ObservablePoint {
    return this._sliceSize
  }

  private _objectFit: Properties['objectFit'] = 'none'

  set objectFit(value) {
    if (this.objectFit !== value) {
      this._objectFit = value
      this.shouldUpdateBounds('objectFit')
      this._onUpdate()
    }
  }

  get objectFit() {
    return this._objectFit
  }

  private _rounded = 0

  set rounded(value) {
    value = value <= 0 ? 0 : value
    if (this.rounded !== value) {
      this._rounded = value
      this._onUpdate()
    }
  }

  _onUpdate(_point?: ObservablePoint | undefined) {
    if (this._complete)
      super._onUpdate(_point)
  }

  get rounded() {
    return this._rounded
  }

  private _complete = false

  private _onImageComplete() {
    if (!this.image)
      return
    this._imageSize.set(
      this.image.width,
      this.image.height,
    )

    this.size = this.options?.size ?? {
      x: this.image.width,
      y: this.image.height,
    }

    this.slice = this.options?.slice ?? this.slice

    this.sliceSize = this.options?.sliceSize ?? {
      x: this.size.x,
      y: this.size.y,
    }

    this.objectFit = this.options?.objectFit ?? this.objectFit

    this.rounded = this.options?.rounded ?? this.rounded
    this._complete = true
    this._onUpdate()
  }

  get _shouldUpdate(): boolean {
    return true
  }

  private get _isSlice() {
    return (!!this.slice.x || !!this.slice.y) || !this.sliceSize.equals(this.size)
  }

  private renderRoundedClip(ctx: CanvasRenderingContext2D, position: PointData, size: PointData) {
    drawRectCompatible(ctx, position, size, this.rounded)
    ctx.clip()
  }

  protected _render(ctx: CanvasRenderingContext2D): void {
    if (!this.image || !this._complete) {
      return
    }
    if (!this._isSlice) {
      const _size = this.size.clone()
      const _position = this.position.clone()
      const scaleDiff = _size.x / this._imageSize.x
      // const diffSize = calcDiff([this._imageSize.x, this._imageSize.y])
      // const diff = diffSize * scaleDiff
      const slim = this._imageSize.x < this._imageSize.y
      const fat = this._imageSize.x > this._imageSize.y
      console.log({
        slim,
        fat,
      })
      if (slim || fat) {
        switch (this.objectFit) {
          case 'contain':
            if (slim) {
              const diff = _size.x - this._imageSize.x * scaleDiff
              this.position.set(this.position.x - diff / 2, this.position.y)
              this.size.set(this.size.x - diff, this.size.y)
            }
            else if (fat) {
              const diff = _size.y - this._imageSize.y * scaleDiff
              console.log(diff)
              this.position.set(this.position.x, this.position.y + diff / 2)
              this.size.set(this.size.x, this.size.y - diff)
            }
            this.renderRoundedClip(ctx, this.position, this.size)
            break
          case 'cover':
            if (slim) {
              const diff = _size.x - this._imageSize.x * scaleDiff
              this.position.set(this.position.x + diff / 2, this.position.y)
              this.size.set(this.size.x + diff, this.size.y)
            }
            else if (fat) {
              const diff = _size.y - this._imageSize.y * scaleDiff
              this.position.set(this.position.x - diff / 2, this.position.y)
              this.size.set(this.size.x + diff, this.size.y)
            }
            this.renderRoundedClip(ctx, _position, _size)
            break
          default:
            this.renderRoundedClip(ctx, this.position, this.size)
        }
      }
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y,
      )
      this.position = _position
      this.size = _size
    }
    else {
      if (this.objectFit !== 'none') {
        console.warn('裁剪图片不支持objectFit')
      }
      const args = [
        this.image,
        this.slice.x,
        this.slice.y,
        this.sliceSize.x,
        this.sliceSize.y,
        this.x,
        this.y,
        this.size.x,
        this.size.y,
      ] as const
      this.renderRoundedClip(ctx, this.position, this.size)
      ctx.drawImage(...args)
    }
  }

  protected updateRawSize(): void {
    this.changeRawSize(this.size.x, this.size.y)
  }
}
