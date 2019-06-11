import React, { useEffect, useState, ReactNode } from 'react'

interface DragAndDropProps {
  children: ReactNode
  handleDrop: Function
}

const DragAndDrop = (props: DragAndDropProps) => {
  const [dragging, setDragging] = useState(false)
  const setDragState = (value: boolean) => {
    setDragging(value)
  }

  let dragCounter: number

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter += 1
    if (
      e.dataTransfer !== null &&
      e.dataTransfer.items &&
      e.dataTransfer.items.length > 0
    ) {
      setDragState(true)
    }
  }
  const handleDragOut = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // dragCounter -= 1
    if (dragCounter === 0) {
      setDragState(false)
    }
  }
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragState(false)
    if (
      e.dataTransfer !== null &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      props.handleDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      dragCounter = 0
    }
  }
  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter = 0
  }

  useEffect(() => {
    document.body.addEventListener('dragenter', handleDragIn)
    document.body.addEventListener('dragleave', handleDragOut)
    document.body.addEventListener('dragover', handleDrag)
    document.body.addEventListener('drop', handleDrop)
    return () => {
      document.body.removeEventListener('dragenter', handleDragIn)
      document.body.removeEventListener('dragleave', handleDragOut)
      document.body.removeEventListener('dragover', handleDrag)
      document.body.removeEventListener('drop', handleDrop)
    }
  }, [])

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {dragging && (
        <div
          style={{
            border: 'dashed grey 4px',
            backgroundColor: 'rgba(255,255,255,.8)',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              left: 0,
              textAlign: 'center',
              color: 'grey',
              fontSize: 36,
            }}
          >
            <div>drop here :)</div>
          </div>
        </div>
      )}
      {props.children}
    </div>
  )
}

export default DragAndDrop
