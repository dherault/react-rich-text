import { useCallback, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import _ from 'clsx'

import { BlockProps, DragItem, TopLeft } from '../types'

import { ADD_ITEM_BUTTON_ID, DRAG_ITEM_BUTTON_ID } from '../constants'

import AddIcon from '../icons/Add'
import DragIcon from '../icons/Drag'

import BlockMenu from './BlockMenu'

const typeToPaddingTop = {
  text: 3,
  heading1: 24,
  heading2: 18,
  heading3: 12,
  todo: 3,
  'bulleted-list': 3,
  'numbered-list': 3,
  quote: 5,
} as const

const typeToPaddingBottom = {
  text: 3,
  heading1: 9,
  heading2: 9,
  heading3: 9,
  todo: 3,
  'bulleted-list': 3,
  'numbered-list': 3,
  quote: 5,
} as const

const typeToIconsExtraPaddingTop = {
  text: 0,
  heading1: 6,
  heading2: 4,
  heading3: 1,
  todo: 0,
  'bulleted-list': 0,
  'numbered-list': 0,
  quote: 0,
} as const

function Block({
  children,
  readOnly,
  id,
  type,
  index,
  hovered,
  paddingLeft,
  onAddItem,
  onDeleteItem,
  onDuplicateItem,
  onMouseDown,
  onMouseMove,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  onBlockMenuOpen,
  onBlockMenuClose,
  focusContent,
  focusContentAtStart,
  focusNextContent,
  blurContent,
}: BlockProps) {
  const dragRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState<TopLeft | null>(null)

  /* ---
    DRAG AND DROP
  --- */
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: 'block',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!dragRef.current) return

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = dragRef.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      // Time to actually perform the action
      onDrag(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'block',
    item() {
      onDragStart()

      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end(_item, monitor) {
      onDragEnd()

      if (!monitor.didDrop()) return

      onMouseMove()
    },
  })

  drag(dragRef)
  drop(preview(previewRef))

  const opacity = isDragging ? 0.01 : 1

  /* ---
    BLOCK MENU POSITIONING AND TRIGGER
  --- */
  const handleDragClick = useCallback(() => {
    if (!previewRef.current) return
    if (!dragRef.current) return

    const previewRect = previewRef.current.getBoundingClientRect()
    const dragRect = dragRef.current.getBoundingClientRect()

    setMenuPosition({
      top: dragRect.top - previewRect.top - 4,
      left: dragRect.left - previewRect.left + 12,
    })
    onBlockMenuOpen()
  }, [onBlockMenuOpen])

  const handleBlockMenuClose = useCallback(() => {
    setMenuPosition(null)
    onBlockMenuClose()
  }, [onBlockMenuClose])

  /* ---
    MAIN RETURN STATEMENT
  --- */
  return (
    <div
      ref={previewRef}
      data-handler-id={handlerId}
      data-react-block-text-id={id}
      className="flex"
      style={{ opacity }}
      onMouseDown={() => !menuPosition && onMouseDown()}
      onMouseMove={() => !menuPosition && onMouseMove()}
      onMouseEnter={() => !menuPosition && onMouseMove()}
      onMouseLeave={() => !menuPosition && onMouseLeave()}
    >
      <div
        onClick={focusContentAtStart}
        className="cursor-text flex-shrink-0"
        style={{ width: paddingLeft }}
      />
      <div className="flex-grow flex items-start relative">
        {!readOnly && (
          <div
            className="flex-shrink-0 flex items-center opacity-0 transition-opacity duration-300 text-gray-500"
            style={{
              opacity: hovered ? 1 : 0,
              marginTop: typeToPaddingTop[type] + typeToIconsExtraPaddingTop[type],
            }}
          >
            <div
              id={ADD_ITEM_BUTTON_ID}
              className={_('p-1 hover:bg-gray-100 rounded cursor-pointer', {
                'opacity-0': !!menuPosition,
              })}
              onClick={onAddItem}
            >
              <AddIcon width={18} />
            </div>
            <div
              ref={dragRef}
              id={DRAG_ITEM_BUTTON_ID}
              onClick={handleDragClick}
              onMouseDown={blurContent}
              className="py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <DragIcon width={18} />
            </div>
          </div>
        )}
        <div
          onClick={focusContentAtStart}
          className="w-1 cursor-text"
        />
        <div className="flex-grow cursor-text">
          <div
            onClick={focusContent}
            style={{ height: typeToPaddingTop[type] }}
          />
          <div style={{ height: `calc(100% - ${typeToPaddingTop[type] + typeToPaddingBottom[type]}px)` }}>
            {children}
          </div>
          <div
            onClick={focusNextContent}
            style={{ height: typeToPaddingBottom[type] }}
          />
        </div>
        {!!menuPosition && (
          <BlockMenu
            onDeleteItem={onDeleteItem}
            onDuplicateItem={onDuplicateItem}
            onClose={handleBlockMenuClose}
            {...menuPosition}
          />
        )}
      </div>
    </div>
  )
}

export default Block
