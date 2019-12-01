import game from 'natives';
import Color from "../utils/Color.mjs";
import Point from "../utils/Point.mjs";
import IElement from "./IElement.mjs";
export default class Text extends IElement {
    constructor(caption, pos, scale, color, font, centered) {
        super();
        this.caption = caption;
        this.pos = pos;
        this.scale = scale;
        this.color = color || new Color(255, 255, 255, 255);
        this.font = font || 0;
        this.centered = centered || false;
    }
    Draw(caption, pos, scale, color, font, centered) {
        if (caption && !pos && !scale && !color && !font && !centered) {
            pos = new Point(this.pos.X + caption.Width, this.pos.Y + caption.Height);
            scale = this.scale;
            color = this.color;
            font = this.font;
            centered = this.centered;
        }
        const x = pos.X / 1280.0;
        const y = pos.Y / 720.0;
        game.setTextFont(parseInt(font));
        game.setTextScale(scale, scale);
        game.setTextColour(color.R, color.G, color.B, color.A);
        game.setTextCentre(centered);
        game.beginTextCommandDisplayText("STRING");
        Text.AddLongString(caption);
        game.endTextCommandDisplayText(x, y, 0);
    }
    static AddLongString(text) {
        if (text.length) {
            const maxStringLength = 99;
            for (let i = 0, position; i < text.length; i += maxStringLength) {
                let currentText = text.substr(i, i + maxStringLength);
                let currentIndex = i;
                if ((currentText.match(/~/g) || []).length % 2 !== 0) {
                    position = currentText.lastIndexOf('~');
                    //if(position > 0 && currentText[position - 1] === ' ') { // Doesn't the substring auto add a space?
                    //	position--;
                    //}
                    i -= (maxStringLength - position);
                }
                else {
                    position = Math.min(maxStringLength, text.length - currentIndex);
                }
                game.addTextComponentSubstringPlayerName(text.substr(currentIndex, position));
            }
        }
    }
}
export { Text };
