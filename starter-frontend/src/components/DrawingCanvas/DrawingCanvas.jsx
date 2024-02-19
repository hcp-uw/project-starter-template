import { useState, useEffect, useRef } from 'react'
import PropTypes from "prop-types";
import { upload } from '../../services/image'
import './DrawingCanvas.css'

const colors = ['black', 'red', 'green', 'blue', 'yellow']

const ColorSelector = (props) =>  (
  <div className='color-selector'>
    <select onChange={e => props.setColor(e.target.value)}>
      {colors.map(color => (
        <option key={color} value={color}>
          {color}
        </option>
      ))}
    </select>
  </div>
)

ColorSelector.propTypes = {
  setColor: PropTypes.func.isRequired
}

const BrushSizeSlider = (props) => (
  <div className='brush-size-slider'>
    <input
      type='range'
      min={1}
      max={50}
      value={props.brushSize}
      onChange={e => props.setBrushSize(e.target.value)}
    />
  </div>
)

BrushSizeSlider.propTypes = {
  brushSize: PropTypes.number.isRequired,
  setBrushSize: PropTypes.func.isRequired
}

const DrawingCanvas = () => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [lines, setLines] = useState([])
  const [currentLine, setCurrentLine] = useState([])
  const [color, setColor] = useState('black')
  const [brushSize, setBrushSize] = useState(5)
  const canvasRef = useRef(null)

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    setCurrentLine([{ x: offsetX, y: offsetY, color, brushSize }])
    setIsDrawing(true)
  }

  const endDrawing = () => {
    setLines([...lines, currentLine])
    setCurrentLine([])
    setIsDrawing(false)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }
    const { offsetX, offsetY } = nativeEvent
    setCurrentLine(prevLine => [...prevLine, { x: offsetX, y: offsetY, color, brushSize }])
  }

  const clear = () => {
    setLines([])
    setCurrentLine([])
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.lineJoin = 'round'
    context.lineWidth = brushSize

    lines.forEach(line => {
      context.beginPath()
      line.forEach(({ x, y, color, brushSize }) => {
        context.strokeStyle = color
        context.lineWidth = brushSize
        context.lineTo(x, y)
      })
      context.stroke()
    })

    context.beginPath()
    currentLine.forEach(({ x, y, color, brushSize }) => {
      context.strokeStyle = color
      context.lineWidth = brushSize
      context.lineTo(x, y)
    })
    context.stroke()
  }, [lines, currentLine, brushSize])

  const handleExport = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'canvas.png'
    link.click()
  }

  const handleUpload = async () => {
    const canvas = canvasRef.current
    const image = canvas.toDataURL('image/png')
    await upload(image)
    // refresh the page to show the new image
    window.location.reload()
  }

  return (
    <div className='drawing-canvas-container'>
      <canvas
        className='drawing-canvas'
        ref={canvasRef}
        width={700}
        height={500}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
      />

      <div className='brush-config'>
        <ColorSelector setColor={setColor} />
        <BrushSizeSlider brushSize={brushSize} setBrushSize={setBrushSize} />
      </div>

      <div className='control-buttons'>
        <button className='export-button' onClick={handleExport}>Export</button>
        <button className='clear-button' onClick={clear}>Clear</button>
        <button className='upload-button' onClick={handleUpload}>Upload</button>
      </div>
    </div>
  )
}

export default DrawingCanvas
