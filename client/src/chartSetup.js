import { Chart, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);
