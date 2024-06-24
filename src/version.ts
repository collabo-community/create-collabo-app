import package_json from '../package.json';
import { prettify } from '../lib/js/helpers/prettify';

export const version = () => {
prettify.log.color.none(
`
create-collabo-app v${package_json.version}
`
);
}
