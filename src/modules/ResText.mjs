import * as alt from 'alt';
import game from 'natives';
import Alignment from "../enums/Alignment.mjs";
import Color from "../utils/Color.mjs";
import Point from "../utils/Point.mjs";
import Size from "../utils/Size.mjs";
import Text from "./Text.mjs";
import { Screen } from "../utils/Screen.mjs";
export default class ResText extends Text {
    constructor(caption, pos, scale, color, font, centered) {
        super(caption, pos, scale, color || new Color(255, 255, 255), font || 0, false);
        this.TextAlignment = Alignment.Left;
        this.Wrap = 0;
        if (centered)
            this.TextAlignment = centered;
    }
    get WordWrap() {
        return new Size(this.Wrap, 0);
    }
    set WordWrap(value) {
        this.Wrap = value.Width;
    }
    Draw(arg1, pos, scale, color, font, arg2, dropShadow, outline, wordWrap) {
        let caption = arg1;
        let centered = arg2;
        let textAlignment = arg2;
        if (!arg1)
            arg1 = new Size(0, 0);
        if (arg1 && !pos) {
            textAlignment = this.TextAlignment;
            caption = this.caption;
            pos = new Point(this.pos.X + arg1.Width, this.pos.Y + arg1.Height);
            scale = this.scale;
            color = this.color;
            font = this.font;
            if (centered == true || centered == false) {
                centered = this.centered;
            }
            else {
                centered = undefined;
                dropShadow = this.DropShadow;
                outline = this.Outline;
                wordWrap = this.WordWrap;
            }
        }
        const screenw = Screen.width;
        const screenh = Screen.height;
        const height = 1080.0;
        const ratio = screenw / screenh;
        const width = height * ratio;
        const x = this.pos.X / width;
        const y = this.pos.Y / height;
        game.setTextFont(parseInt(font));
        game.setTextScale(1.0, scale);
        game.setTextColour(color.R, color.G, color.B, color.A);
        if (centered !== undefined) {
            game.setTextCentre(centered);
        }
        else {
            if (dropShadow)
                game.setTextDropshadow(2, 0, 0, 0, 0);
            if (outline)
                alt.logWarning("[NativeUI] ResText outline not working!");
            switch (textAlignment) {
                case Alignment.Centered:
                    game.setTextCentre(true);
                    break;
                case Alignment.Right:
                    game.setTextRightJustify(true);
                    game.setTextWrap(0.0, x);
                    break;
            }
            if (this.Wrap) {
                const xsize = (this.pos.X + this.Wrap) / width;
                game.setTextWrap(x, xsize);
            }
        }
        game.beginTextCommandDisplayText("STRING");
        Text.AddLongString(caption);
        game.endTextCommandDisplayText(x, y, 0);
    }
}
