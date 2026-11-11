import {
  Droplets,
  Fence,
  Hammer,
  HardHat,
  Package,
  Route,
  Sofa,
  Trophy,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceId } from "../../data/site";

export const serviceIcons: Record<ServiceId, LucideIcon> = {
  civil: HardHat,
  materials: Package,
  renovation: Hammer,
  plumbingElectrical: Droplets,
  infrastructure: Route,
  interior: Sofa,
  fabrication: Fence,
  sports: Trophy,
  maintenance: Wrench,
};
