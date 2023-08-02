import './index.css'

import ReactBlockText from './components/ReactBlockText'

import headerPlugin from './plugins/header'
import listPlugin from './plugins/list'
import quotePlugin from './plugins/quote'
import todoPlugin from './plugins/todo'
import imagePlugin from './plugins/image'

export { VERSION } from './constants'

export { default as ColorsContext } from './context/ColorsContext'

export {
  headerPlugin,
  listPlugin,
  quotePlugin,
  todoPlugin,
  imagePlugin,
}

export type {
  ReactBlockTextData,
  ReactBlockTextDataItem,
  ReactBlockTextDataItemType,
  ReactBlockTextOnChange,
  ReactBlockTextPlugin,
  ReactBlockTextPluginData,
  ReactBlockTextPluginOptions,
  ReactBlockTextPlugins,
  ReactBlockTextProps,
} from './types'

export default ReactBlockText
