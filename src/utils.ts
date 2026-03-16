export type Tool = 'circle' | 'rectangle' | 'triangle' | 'diamond' | 'star' | 'hexagon';

export interface SketchElement {
    id: string;
    type: Tool;
    x: number;
    y: number;
    color: string;
    width?: number;
    height?: number;
}

export interface MoveableElementProps {
    element: SketchElement;
    onMove: (id: string, x: number, y: number) => void;
    onSelect: (id: string) => void;
    isSelected: boolean;
}

export const getToolIcon = (toolType: Tool) => {
    switch (toolType) {
        case "circle":
            return "●";
        case "rectangle":
            return "▭";
        case "triangle":
            return "▲";
        case "diamond":
            return "◆";
        case "star":
            return "★";
        case "hexagon":
            return "⬡";
        default:
            return "●";
    }
};

export const COLORS = [
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EF4444", // Red
];
