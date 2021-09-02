import history from '@/route';
import luckyGame from './index';

window.app = new luckyGame.Application({
    dom: document.getElementById('warp'),
    store: new luckyGame.Store(),
    history
});

window.app.start();
window.app.history.push('/building', {});
