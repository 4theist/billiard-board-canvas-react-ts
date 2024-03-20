import React, { useState } from 'react';
import s from '../ColorPalette/ColorPalette.module.css'
interface ColorPaletteProps {
    id: number
    selectedColor: string;
    onChangeColor: (id: number, color: string) => void;
    position: { x: number; y: number; };
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ id, selectedColor, onChangeColor, position }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeColor(id, event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsVisible(false);
    };

    return (
        <div className={s.root}
            style={{
                position: 'absolute',
                top: position?.y,
                left: position?.x,
                transform: 'translate(50%, 50%)',
            }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="color"
                    value={selectedColor}
                    onChange={handleColorChange}
                />

            </form>
            {/* <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                onSubmit={handleSubmit}
            /> */}
        </div>
    );
};

export default ColorPalette;
