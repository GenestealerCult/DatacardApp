var handlebarsRuntime = require("handlebars/runtime");
import NAMES from "./json/names.json";
const symbolTemplate = require("./templates/symbol.handlebars");

handlebarsRuntime.registerHelper("isInjured", function (wounds, index) {
  return index > wounds / 2 ? "injured" : "";
});

handlebarsRuntime.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
});

export default {
  handlebarsRuntime: handlebarsRuntime,

  getExtension: (str) => str.slice(str.lastIndexOf(".")),

  removeParentheses: (str) => str.replace(/ *\([^)]*\) */g, ""),

  // removeSpecialChars: (str) => this.removeParentheses(str).replace(/[^a-zA-Z0-9 ]/g, ""),

  getRestfulURL: (str) => str.replace(/[^a-zA-Z]/g, "").toLowerCase(),

  replaceSymbols: function (str) {
    const symbolsMap = {
      "⬤": symbolTemplate({ color: "white", symbol: "⬤" }),
      "⬛": symbolTemplate({ color: "blue", symbol: "■" }),
      "■": symbolTemplate({ color: "blue", symbol: "■" }),
      "⬟": symbolTemplate({ color: "red", symbol: "⬟" }),
    };
    return new handlebarsRuntime.SafeString(
      ("" + str).replace(/⬤|⬛|■|⬟/gi, function (m) {
        return symbolsMap[m];
      })
    );
  },

  deepMap: function (value, mapFn, thisArg, key, cache = new Map()) {
    if (cache.has(value)) {
      return cache.get(value);
    }
    if (Array.isArray(value)) {
      let result = [];
      cache.set(value, result);

      for (let i = 0; i < value.length; i++) {
        result.push(this.deepMap(value[i], mapFn, thisArg, i, cache));
      }
      return result;
    } else if (value != null && /object|function/.test(typeof value)) {
      let result = {};
      cache.set(value, result);
      for (let key of Object.keys(value)) {
        result[key] = this.deepMap(value[key], mapFn, thisArg, key, cache);
      }
      return result;
    } else {
      return value ? mapFn.call(thisArg, value, key) : value;
    }
  },

  getRandomFromArray: function (array) {
    if (array == undefined || array == null || !array || !array.length)
      return "";
    return array[Math.floor(Math.random() * array.length)];
  },

  getSubfactions: function (f) {
    for (const faction of NAMES) {
      for (const name of faction.faction) {
        if (name == f) return Object.keys(faction.names);
      }
    }
    return [];
  },

  randomName: function (f, subfaction) {
    for (const faction of NAMES) {
      for (const name of faction.faction) {
        if (name == f) {
          const names = faction.names[subfaction];
          return [
            this.getRandomFromArray(names.first),
            this.getRandomFromArray(names.second),
            this.getRandomFromArray(names.third),
          ]
            .filter(Boolean)
            .join(" ")
            .trim();
        }
      }
    }
  },

  registerDraggable: function (el) {
    el.on("mousedown touchstart", function (e) {
      e.preventDefault();
      console.log("Move card image");

      var elepos, mousedown;
      mousedown = {
        x: e.originalEvent.pageX || e.originalEvent.touches[0].pageX,
        y: e.originalEvent.pageY || e.originalEvent.touches[0].pageY,
      };
      var cssPos = el
        .css("backgroundPosition")
        .match(/\((.*?)\)/g)
        .map(function ($0) {
          return $0.substring(1, $0.length - 1);
        });
      elepos = {
        x: parseInt(
          cssPos[0].replace("50%", "").replace("px", "").replace(/ /g, "")
        ),
        y: parseInt(
          cssPos[1].replace("100%", "").replace("px", "").replace(/ /g, "")
        ),
      };
      $(document).on("mouseup touchend", function (e) {
        console.log("Unbinding card image move events");
        return $(document).unbind("mousemove touchmove");
      });
      return $(document).on("mousemove touchmove", function (e) {
        const mouseposition = {
          x:
            e.originalEvent.pageX ||
            e.originalEvent.changedTouches[0].pageX ||
            mousedown.x,
          y:
            e.originalEvent.pageY ||
            e.originalEvent.changedTouches[0].pageY ||
            mousedown.y,
        };
        if (mousedown !== mouseposition) {
          var position = {
            x: elepos.x + mouseposition.x - mousedown.x,
            y: elepos.y + mouseposition.y - mousedown.y,
          };
          position.x = position.x ? position.x : 1;
          position.y = position.y ? position.y : 1;
          el.css({
            "background-position":
              "calc(50% + " +
              position.x +
              "px) calc(100% + " +
              position.y +
              "px)", //position.x + "px " + position.y + "px",
          });
        }
      });
    });
  },

  registerDropzones: function (selector, inputfield, callback) {
    // Handle drag and drop file upload
    $(selector).on("dragover", function (event) {
      console.log("File(s) in drop zone");
      event.preventDefault();
      event.stopPropagation();
    });

    $(selector).on("dragleave", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });

    $(selector).on("drop", function (event) {
      console.log("File(s) dropped");
      event.preventDefault();
      event.stopPropagation();

      var id = $(event.currentTarget).data("id");
      var dataTransfer = event.originalEvent.dataTransfer;

      if (dataTransfer.items) {
        for (var i = 0; i < dataTransfer.items.length; i++) {
          if (dataTransfer.items[i].kind === "file") {
            var file = dataTransfer.items[i].getAsFile();
            callback(id, file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < dataTransfer.files.length; i++) {
          var file = dataTransfer.files[i];
          callback(id, file);
        }
      }
    });

    // Handle file upload from field
    $(inputfield).on("change", function (event) {
      var id = $(event.target).data("id");
      var files = event.target.files;
      for (var i = 0; i < files.length; i++) {
        callback(id, files[i]);
      }
    });
  },

  redrawStripedTables: function () {
    $(".table-tiny").each(function () {
      $(this).find("tr").last().show(); // Make the empty row visible
      const length = $(this).find("tr:visible").length; // Get number of visible rows
      const empty = length == 2; // If only header and empty row, table is empty
      if (!empty) $(this).find("tr").last().hide(); // Hide empty row
      $(this)
        .find("tr:visible")
        .each(function (index) {
          if (index == 0) return; // Skip header
          $(this)
            .removeClass("odd even")
            .addClass(index % 2 == 0 ? "odd" : "even"); // Add odd or even
        });
    });
  },
};
