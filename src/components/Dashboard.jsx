import React, { Component } from 'react';
import _ from 'lodash';

export default class Dashboard extends Component {

    constructor(props) {
        super(props)
    }


    componentDidMount() {
        
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();



        let settings = {
            stepsize: 0.025,
            maxheight: 1,
            trailsize: 10,
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
        var colorfreq = function (i) {
            var frequency = .3;
            i = i % 32;
            var red = Math.ceil(Math.sin(frequency * i + 0) * 127 + 128);
            var green = Math.ceil(Math.sin(frequency * i + 2) * 127 + 128);
            var blue = Math.ceil(Math.sin(frequency * i + 4) * 127 + 128);
            return "rgba(" + red + "," + green + "," + blue + "," + settings.alpha + ")";
        }

        var x = function (t, ps) {
            return 120 * Math.sin(settings.freqA * t) + 200
        }
        var y = function (t, ps) {
            return 120 * Math.cos(settings.freqB * t) + 200
        }
        var dot = function (ctx, x, y, offset) {

            ctx.save();
            ctx.fillRect(20 + x, 20 + y, 0.5 + (offset / 32) * settings.maxheight, 0.5 + (offset / 32) * settings.maxheight);
            ctx.restore();
        }

        var ctx = document.getElementById("canvas").getContext('2d');
        var offset = 0;
        (function animloop() {
            offset = (offset + 1) % 360;
            requestAnimFrame(animloop);
            ctx.fillStyle = "rgba(0,0,0," + settings.decay + ")";
            ctx.fillRect(0, 0, 500, 500);
            var v = Math.ceil(Math.abs(Math.sin(deg2rad(offset)) * 32));
            ctx.fillStyle = colorfreq(v);
            for (let i = offset; i < settings.trailsize + offset; i += settings.stepsize) {
                dot(ctx, x(deg2rad(i), v), y(deg2rad(i), v), v);
            }
        })();

    }

    render() {

        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                <canvas height="500" width="500" id="canvas"></canvas>
            </div>
        );
    }
}



