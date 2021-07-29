import React, { Component } from 'react';
import _ from 'lodash';
import { initializeSnapshot, updateSnapshot } from '@kiranbandi/snapshot';

export default class Dashboard extends Component {

    constructor(props) {
        super(props)
    }


    componentDidMount() {

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 10000 / 60);
            };
        })();

        // isAutomaticMode ON or OFF, automatic Timer Interval
        initializeSnapshot(false, 1000,
            // Thumbnail Options
            {
                'class': '.snapshot-thumbnail',
                'type': 'canvas',
                'size': { 'width': 235, 'height': 100 }
            },
            // Callback function called when a snapshot is recalled
            (data) => { settings = { ...data } });

        let settings = {
            stepsize: 0.025,
            maxheight: 5,
            trailsize: 100,
            decay: 0.1,
            alpha: 0.4,
            freqA: 12,
            freqB: 11
        };

        var gui = new dat.GUI();
        gui.add(settings, 'freqA', 1, 50);
        gui.add(settings, 'freqB', 1, 50);
        gui.add(settings, 'trailsize', 1, 360);
        gui.add(settings, 'decay', 0.01, 0.99);
        gui.add(settings, 'alpha', 0.01, 0.99);
        gui.add(settings, 'stepsize', 0.010, 1);
        gui.add(settings, 'maxheight', 0.1, 32);
        gui.open();

        var deg2rad = function (angle) {
            return angle * .017453292519943295; // (angle / 180) * Math.PI;
        }

        var x = function (t, ps) {
            return 250 * Math.sin(settings.freqA * t) + 400
        }
        var y = function (t, ps) {
            return 250 * Math.cos(settings.freqB * t) + 400
        }
        var dot = function (ctx, x, y, offset) {
            ctx.save();
            ctx.fillRect(20 + x, 20 + y, 0.5 + (offset / 32) * settings.maxheight, 0.5 + (offset / 32) * settings.maxheight);
            ctx.restore();
        }

        var ctx = document.getElementById("canvas").getContext('2d');
        var offset = 0;
        (function animloop() {

            updateSnapshot(settings);

            offset = (offset + 1) % 360;
            requestAnimFrame(animloop);
            ctx.fillStyle = "rgba(255,255,255," + settings.decay + ")";
            ctx.fillRect(0, 0, 750, 750);
            var v = Math.ceil(Math.abs(Math.sin(deg2rad(offset)) * 32));
            ctx.fillStyle = '#2fa1d6';
            for (let i = offset; i < settings.trailsize + offset; i += settings.stepsize) {
                dot(ctx, x(deg2rad(i), v), y(deg2rad(i), v), v);
            }
        })();

    }

    render() {

        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                <canvas height="800" width="800" id="canvas" className='snapshot-thumbnail'></canvas>
            </div>
        );
    }
}



