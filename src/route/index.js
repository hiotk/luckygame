import RouteHistory from '@/route/history';

import MainScene from '@/scenes/Main';
import LoadScene from '@/scenes/Load';

RouteHistory.init();
RouteHistory.addRoute('/main', new MainScene());
RouteHistory.addRoute('/load', new LoadScene());

RouteHistory.push('/load', {});

export default RouteHistory;
