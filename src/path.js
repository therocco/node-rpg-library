import {getConfig, copyObject} from 'helptos';
import {randomInt} from 'random-tools';
import {createName} from './name';
import * as place from './place';
import * as properties from './properties';

const config = getConfig('../config/path.json', __dirname);
const pathNames = getConfig('../config/names/path-names.json', __dirname);

const name = state => Object.assign({}, properties.mixed('name', state));
const distance = state => Object.assign({}, properties.numericalPositive('distance', state));

const places = state => Object.assign({},
    // get default list functionality
    properties.list(
        'places',
        state
    )
);

const summary = state => ({

    get: () => {
        const path = state.element;

        return {
            name: path.name.get(),
            distance: path.distance.get(),
            places: path.places.list().map(place => place.summary.short())
        };
    },
    short: () => {
        const path = state.element;

        return {
            name: state.element.name.get(),
            distance: path.distance.get(),
        };
    },
    places: {
        get: () => state.element.places.list().map(place => place.summary.get()),
        short: () => state.element.places.list().map(place => place.summary.short())
    }
});


const newPath = (name_in) => {

    let state = copyObject(config);

    state.name = name_in;

    state.element = {
        name: name(state),
        distance: distance(state),
        places: places(state),
        summary: summary(state)
    };

    return state.element;
};

export const createPath = ({currentPlace, name = createName(pathNames)}) => {

    let path = newPath(name),
        newPlace = place.createPlace({}),
        newPlaceDoor = newPlace.doors.list()[0],
        pathDistance = randomInt(3000, 200) / 1000;

    path.distance.up(pathDistance);
    path.places.add(currentPlace);
    path.places.add(newPlace);
    newPlaceDoor.path.set(path);

    return path;
}
