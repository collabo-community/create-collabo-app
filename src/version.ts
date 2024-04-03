import package_json from '../package.json';
import { consoleLog } from '../lib/helpers';

export const version = () => {
consoleLog(
`
create-collabo-app v${package_json.version}
`
);
}
