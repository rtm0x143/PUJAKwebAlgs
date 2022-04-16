import HeaderController from "./Controller/header.controller.js";
import HeaderView from "./View/header.view.js";
import AstarController from './Controller/astar.controller.js';
import AstarModel from './Model/astar.model.js';
import AstarView from './View/astar.view.js';
import Point from './Model/point.js';

new HeaderController(new HeaderView());
// TODO: create normal constructor
new AstarController(new AstarModel());
