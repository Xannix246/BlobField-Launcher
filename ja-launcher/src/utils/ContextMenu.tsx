import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";

type MenuItem = {
  label: string;
  onClick: () => void;
};

type ContextMenuProps = {
  items: MenuItem[];
  children: React.ReactNode;
  style?: string;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ items, children, style }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setVisible(true);
  };
  const className = clsx("absolure w-full h-full", style)

  return (
    <div className={className} onContextMenu={handleContextMenu}>
      {children}
      {visible && (
        <div
          ref={menuRef}
          className="absolute bg-gray-800 shadow-lg border rounded-md py-1 z-50"
          style={{ top: position.y, left: position.x }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                item.onClick();
                setVisible(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
