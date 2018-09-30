import _ from 'lodash';
import {randInt, sum} from '../../core/util.js';

export default function plantSpiral({forkCount=0, angle=0}) {
  var positions = [];

  // var generatePathPositions = ({angle, originPosition}) => {
  //   var stalkLength;
  //   var spiralRingCount;
  //
  //   var fx = x => {
  //     //at some point switch from x =
  //   };
  //
  //   positions.push();
  // };
  //
  // //position
  // generatePath({angle, originPosition: {x: 0, y: 0}});
  //
  // _.times(forkCount, f => { //number of splits from a main path to sub-path
  //   var sides = {left: {scalar: '-1'}, right: {scalar: '1'}};
  //   var sideKey = _.sample(['left', 'right']);
  //   var originPosition = {x: 0, y: 0};
  //
  //   //position
  //   _.times(_.floor(randInt(3)), o => {  //generate up to two offshoots per branch, randomly
  //     if (o === 2) sideKey = sideKey === 'left' ? 'right' : 'left';
  //
  //     generatePath({angle: angle + (70 * sides[sideKey].scalar), originPosition});
  //   });
  //
  // });

  return {positions};
}
