export interface GearProps {
  teeth: number;
  radius: number;
  color: string;
  rotation: number; // in degrees
  x: number;
  y: number;
  label?: string;
  speedLabel?: string;
  showTeeth?: boolean;
}

export interface TimeState {
  totalSeconds: number;
}
