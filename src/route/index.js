import RouteHistory from '@/route/history';

import MainScene from '@/scenes/Main';
import LoadScene from '@/scenes/Load';
import BuildingScene from '@/scenes/Building';

RouteHistory.init();
RouteHistory.addRoute('/main', new MainScene());
RouteHistory.addRoute('/load', new LoadScene());
RouteHistory.addRoute('/building', new BuildingScene());

export default RouteHistory;
