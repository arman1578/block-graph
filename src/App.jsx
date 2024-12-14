import { useState, useRef } from "react";

const App = () => {
  const [blocks, setBlocks] = useState([
    { id: 0, x: Math.random() * window.innerWidth * 0.8, y: Math.random() * window.innerHeight * 0.8, parentId: null },
  ]);

  const handleAddBlock = (parentId) => {
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        id: prevBlocks.length,
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.8,
        parentId,
      },
    ]);
  };

  const handleDragBlock = (id, newX, newY) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, x: newX, y: newY } : block
      )
    );
  };

  const Block = ({ id, x, y, onDrag, onAddChild }) => {
    const blockRef = useRef(null);

    const handleDrag = (e) => {
      const offsetX = e.clientX - blockRef.current.offsetWidth / 2;
      const offsetY = e.clientY - blockRef.current.offsetHeight / 2;
      onDrag(id, offsetX, offsetY);
    };

    return (
      <div
        ref={blockRef}
        className="absolute bg-blue-500 text-white text-center font-bold p-4 rounded shadow-lg"
        style={{ left: x, top: y, width: 150, height: 150, zIndex: 10 }}
        onMouseDown={(e) => {
          e.preventDefault();
          document.addEventListener("mousemove", handleDrag);
          document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleDrag);
          });
        }}
      >
        {id}
        <button
          className="block mt-4 mx-auto bg-blue-300 p-2 rounded shadow"
          onClick={() => onAddChild(id)}
        >
          +
        </button>
      </div>
    );
  };

  const Connection = ({ parent, child }) => {
    const lineStyle = {
      position: "absolute",
      background: "black",
      border: "1px dashed",
      transformOrigin: "top left",
      zIndex: 0,
    };

    const parentCenterX = parent.x + 75;
    const parentBottomY = parent.y + 150;
    const childCenterX = child.x + 75;
    const childTopY = child.y;

    const dx = childCenterX - parentCenterX;
    const dy = childTopY - parentBottomY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
      <div
        style={{
          ...lineStyle,
          top: parentBottomY,
          left: parentCenterX,
          width: length,
          height: 0,
          transform: `rotate(${angle}deg)`,
        }}
      ></div>
    );
  };

  return (
    <div className="relative w-screen h-screen bg-gray-400 overflow-hidden">
      {blocks.map((block) => (
        <Block
          key={block.id}
          id={block.id}
          x={block.x}
          y={block.y}
          onDrag={handleDragBlock}
          onAddChild={handleAddBlock}
        />
      ))}
      {blocks.map((block) => {
        const parent = blocks.find((b) => b.id === block.parentId);
        return parent ? (
          <Connection
            key={`${parent.id}-${block.id}`}
            parent={parent}
            child={block}
          />
        ) : null;
      })}
    </div>
  );
};

export default App;
