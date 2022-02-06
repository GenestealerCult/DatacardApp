// Libraries
require("jszip");
import "./lib/bootstrap.min.css";

// Local imports
import "./css/styles.css";
require('bootstrap-icons/font/bootstrap-icons.css');
import IMAGES from "./json/images.json";
import Leader from "./gene-leader.jpg";
import Tweet from "./tweet.png";
import Helpers from "./helpers.js";

// Global variables
var large = true;
var operatorcards = true;
var TEXT_SMALL = '<i class="bi bi-arrows-angle-contract"></i> Switch to small format';
var TEXT_LARGE = '<i class="bi bi-arrows-angle-expand"></i> Switch to large format';
var TEXT_RULECARDS = '<i class="bi bi-list-check"></i> Switch to rulecards';
var TEXT_DATACARDS = '<i class="bi bi-person-lines-fill"></i> Switch to datacards';

const SPECIALISM = ["Combat", "Staunch", "Marksman", "Scout"];

// Templates
var datacardTemplate = require("./templates/datacard.handlebars");

// Example
const exampleCards = [
  {
    id: "id-1",
    operator: true,
    equipment: true,
    generator: true,
    subfactions: ["All"],
    title: "Genestealer Leader (with gold medal and claws)",
    description: 'Test, XP 40',
    faction: "Hive Fleet",
    original: "Genestealer Leader (with gold medal and claws)",
    rank: 'grizzled',
    specialism: 'combat',
    primary_category: "Hive Fleet",
    secondary_categories: ", Tyranid, Genestealer, more categories",
    photo: Leader,
    stats_m: "■",
    stats_apl: "■",
    stats_ga: "■",
    stats_df: "■",
    stats_sv: "■",
    stats_w: "■",
    wounds: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
    abilities: [
      {
        title: "Equipment ability here (2 EP)",
        description: "Quick brown fox jumps over the lazy marine",
        equipment: true,
      },
    ],
    unique_actions: [
      {
        title: "First unique action here (2 AP)",
        description: "Only this fox jumps over the lazy marines",
      },
    ],
    weapons: [
      {
        title: Helpers.removeParentheses("Weapon name"),
        stats_a: "■",
        stats_wsbs: "■",
        stats_d: "■/■",
        stats_sr: "Special rule",
        stats_critical: "-",
      },
      {
        title: Helpers.removeParentheses("Longer weapon name"),
        stats_a: "■",
        stats_wsbs: "■",
        stats_d: "■/■",
        stats_sr: "Special rule",
        stats_critical: "Critical rule",
      },
      {
        title: Helpers.removeParentheses(
          "Very long weapon name (with parentheses)"
        ),
        stats_a: "■",
        stats_wsbs: "■",
        stats_d: "■/■",
        stats_sr: "",
        stats_critical: "Critical rule",
      },
    ],
    rules: [
      {
        title: "Special rule",
        description: "Special rule description here",
      },
      {
        title: "Equipment rule",
        equipment: true,
        description: "Equipment rule description here",
      },
    ],
    battleHonours: [
      {
        title: "Battle Honour",
        description: "Battle honour rule description here",
      }
    ],
    battleScars: [
      {
        title: "Battle Scars",
        description: "Battle scars rule description here",
      }
    ],
  },
  {
    id: "id-2",
    operator: false,
    equipment: true,
    title: "Equipment ability here (2 EP)",
    description: "Equipment",
    abilities: [
      {
        title: "Equipment ability here",
        description: "Quick brown fox jumps over the lazy marine",
      },
    ],
    unique_actions: [],
    weapons: [],
    rules: [
      {
        title: "Equipment rule",
        equipment: true,
        description: "Equipment rule description here",
      },
    ],
  },  
];

// Site builders
function text(size, text) {
  const element = document.createElement("p");
  element.classList.add("text-white", "text-" + size);
  element.innerHTML = text;
  return element;
}
function renderHero() {
  const element = document.createElement("div");
  element.classList.add("hero");
  element.classList.add("no-print");

  const title = document.createElement("h1");
  title.classList.add(
    "text-55",
    "uppercase",
    "heading",
    "font-heading",
    "text-center",
    "text-orange"
  );
  title.innerHTML = "KT 2021 Datacards";
  element.appendChild(title);

  const subtitle = document.createElement("h1");
  subtitle.classList.add(
    "text-24",
    "uppercase",
    "heading",
    "font-heading",
    "text-center",
    "text-white"
  );
  subtitle.innerHTML =
    "Convert KT 2021 BattleScribe roster to printable datacards";
  element.appendChild(subtitle);

  const dropzone = document.createElement("div");
  dropzone.id = "dropzone";
  dropzone.classList.add(
    "text-24",
    "uppercase",
    "heading",
    "font-heading",
    "text-center",
    "text-white"
  );
  dropzone.innerHTML = "Drop your Battle Scribe roster file (.rosz) here";
  element.appendChild(dropzone);

  const upload = document.createElement("p");
  upload.classList.add("text-center");
  const file = document.createElement("input");
  file.id = "file";
  file.type = "file";
  file.name = "file";
  file.accept = ".rosz";
  file.hidden = "true";
  upload.appendChild(file);

  const label = document.createElement("label");
  label.setAttribute("for", "file");
  label.classList.add(
    "text-18",
    "uppercase",
    "heading",
    "font-heading",
    "text-center",
    "text-white",
    "button"
  );
  label.innerHTML = "or click here to choose .rosz file from your computer";
  upload.appendChild(label);

  element.appendChild(upload);

  const row = document.createElement("div");
  row.classList.add("row");

  const col1 = document.createElement("div");
  col1.classList.add("col");
  col1.appendChild(
    text(
      14,
      `This card generator creates printable Kill Team 2021 cards from your 
        BattleScribe roster file in your browser. <a href="https://battlescribe.net/" class="text-orange bold">
          You can download Battle Scribe here »</a><br /><br />
          Scroll down for example template. If you don't have your KT 2021 roster yet, 
          try swapping the card image, position it correctly by dragging it, 
          edit the unit name and other data, switch to small format, and print the card!
        `
    )
  );
  row.appendChild(col1);

  const col2 = document.createElement("div");
  col2.classList.add("col");
  col2.appendChild(
    text(
      14,
      `PRIVACY & PROTECTION: No data, including your BattleScribe roster file
        or images, will be sent anywhere. The magic happens
        locally in your browser. Works offline too.`
    )
  );
  row.appendChild(col2);

  const col3 = document.createElement("div");
  col3.classList.add("col");
  col3.appendChild(
    text(
      14,
      `UNOFFICIAL: This card maker is unnofficial, and intended for personal use only.
        The website code does not include any text, artwork or imagery copied from GW material. 
        All rules and stats on the datacards are read from your personal BattleScribe roster file,
        and default images of the units hotlinked from GW's public site.
        This tool is offered for free, it contains no advertisements, nor is otherwise monetized.`
    )
  );
  row.appendChild(col3);

  element.appendChild(row);

  return element;
}
function button(id, text) {
  const element = document.createElement("div");
  element.classList.add(
    "text-18",
    "uppercase",
    "heading",
    "font-heading",
    "text-center",
    "text-white",
    "button"
  );
  element.innerHTML = text;
  element.id = id;

  return element;
}
function renderButtons() {
  const element = document.createElement("div");
  element.classList.add("buttons");
  element.classList.add("text-center");
  element.classList.add("no-print");

  element.appendChild(button("toggle-datacards", TEXT_SMALL));
  element.appendChild(button("toggle-rulecards", TEXT_RULECARDS));
  element.appendChild(button("print-datacards", 'Print <i class="bi bi-printer"></i> cards'));

  const tweet = button(
    "tweet",
    '<a class="text-white" href="https://twitter.com/intent/tweet?text=I%20made%20%23KillTeam%20datacards%20with%20https://datacard.app/" target="_blank"><img src="' +
      Tweet +
      '" /></a>'
  );
  tweet.classList.add("right");
  element.appendChild(tweet);

  return element;
}
function renderDatacardContainer() {
  const element = document.createElement("div");
  element.id = "datacards";
  return element;
}
function renderDatacards(datacards, preventScroll) {
  $("#datacards").empty();

  for (const properties of datacards) {
    if (!properties.operator) continue;
    properties["size"] = large ? "large" : "small";
    $("#datacards").append(datacardTemplate(properties));
  }

  for (const properties of datacards) {
    if (properties.operator || !properties.equipment) continue;
    properties["size"] = large ? "large" : "small";
    $("#datacards").append(datacardTemplate(properties));
  }

  for (const properties of datacards) {
    if (properties.operator || properties.equipment) continue;
    properties["size"] = large ? "large" : "small";
    $("#datacards").append(datacardTemplate(properties));
  }

  if (operatorcards) {
    $(".operator-card").show();
    $(".rule-card").hide();    
  } else {
    $(".operator-card").hide();
    $(".rule-card").show();    
  }

  // Activate card photo dropzone
  const replacePhoto = function (id, file) {
    $("#" + id + "-triangle").attr(
      "style",
      'background-image: url("' + URL.createObjectURL(file) + '");'
    );
  };
  Helpers.registerDropzones(
    ".photo-dropzone",
    'input[name="photo"]',
    replacePhoto
  );

  // Activate equipment toggle
  $('input[name="toggle-equipment"]').on("change", function (event) {
    var id = $(event.target).data("id");
    if (event.target.checked) {
      $("." + id).hide();
    } else {
      $("." + id).show();
    }
    Helpers.redrawStripedTables();
  });
  Helpers.redrawStripedTables();

  // Activate rules toggle
  $('input[name="toggle-rules"]').on("change", function (event) {
    var id = $(event.target).data("id");
    if (event.target.checked) {
      $("." + id).hide();
    } else {
      $("." + id).show();
    }
  });

  // Activate triangle photo positioning
  $(".triangle-photo").each(function (index) {
    Helpers.registerDraggable($(this));
  });

  // Activate name generator
  $(".randomname").on("click", function (event) {
    const id = $(event.target).data("id").substr(5);
    const faction = $(event.target).data("faction");
    const subfaction = $("#subfaction-" + id).length
      ? $("#subfaction-" + id).val()
      : "All";
    const datacard = $("#datacard-" + id);
    const original = $(event.target).data("original");
    const name = Helpers.randomName(faction, subfaction);
    const title = datacard.find(".card-title");
    const description = datacard.find(".description");
    if (!description.text() || !description.text().trim().length) {
      description.html(original);
    }
    title.html(name);
  });

  if (!preventScroll) {
    // Scroll to first card
    $("html, body").animate({
      scrollTop: parseInt($("#datacards").offset().top),
    });
  }
}

function parseFramefile(roster) {
  var images = {};
  roster.find("div[data-js-figurine-name]").each(function () {
    var name = Helpers.getRestfulURL($(this).attr("data-js-figurine-name"));
    if (name == "warrior") name = "necronwarrior";
    images[name] = {
      src: $(this).find("img").attr("src"),
      // description: $(this).find("span[data-sheets-value]").text(),
    };
  });
  console.log(JSON.stringify(images, null, 2));
}

function parseRoster(roster) {
  function suggestPhoto(name, properties) {
    if (properties["photo"] != undefined && properties["photo"])
      return properties["photo"];
    name = Helpers.getRestfulURL(name);
    if (name in IMAGES) {
      return IMAGES[name]["src"];
    }
    return false;
  }

  var id = 0;
  var datacards = [];
  var rulecards = {};

  const addRulecard = function(title, rulecard) {
    rulecard.operator = false;
    rulecard.equipment = false;
    rulecard.title = title;
    rulecards[Helpers.getRestfulURL(title)] = rulecard;
  }
  
  roster
    .children("roster")
    .children("forces")
    .children("force")
    .each(function () {
      const faction = $(this).attr("catalogueName");
      $(this)
        .children("selections")
        .children("selection")
        .filter('[type="model"],selection[type="upgrade"]')
        .each(function () {
          id += 1;
          var isOperative = false;

          var abilities = {};
          var actions = {};
          var battleHonours = {};
          var battleScars = {};
          var equipments = {};
          var rules = {};

          var customName = $(this).attr("customName");
          var title = customName ? customName : $(this).attr("name");
          var description = customName ? $(this).attr("name") : "";
          var rank;
          var specialsm;

          const subfactions = Helpers.getSubfactions(faction);

          var properties = {
            id: "id-" + id,
            equipment: false,
            operator: true,

            title: title,
            description: description,
            name: Helpers.removeParentheses($(this).attr("name")),
            rank: rank,
            specialsim: specialsm,

            faction: faction,
            generator: subfactions.length > 0,
            subfactions: subfactions,
            original: $(this).attr("name"),

            weapons: [],
            unique_actions: [],
            abilities: [],
            rules: [],
            equipments: [],
            battleHonours: [],
            battleScars: []
          };

          // Test if unit title or 2 first words is found from images
          properties["photo"] = suggestPhoto(properties["name"], properties);
          properties["photo"] = suggestPhoto(
            properties["name"].split(" ").slice(0, 2).join(" "),
            properties
          );

          $(this)
            .children("profiles")
            .children('profile[typeName="Operative"]')
            .each(function () {
              isOperative = true;
             
              // Test if operative name or 2 first words is found from images
              properties["photo"] = suggestPhoto(
                $(this).attr("name"),
                properties
              );
              properties["photo"] = suggestPhoto(
                $(this).attr("name").split(" ").slice(0, 2).join(" "),
                properties
              );

              $(this)
                .children("characteristics")
                .children("characteristic")
                .each(function () {
                  properties["stats_" + $(this).attr("name").toLowerCase()] =
                    $(this).text();

                  if ($(this).attr("name").toLowerCase() == "w") {
                    properties["wounds"] = Array.from(
                      Array(parseInt($(this).text())).keys()
                    );
                  }
                });                             
            });
          
          $(this)
            .children("selections")
            .children("selection")
            .each(function() {
              var name = $(this).attr("name");

              if(name == 'XP') {
                let number = parseInt($(this).attr('number'));
                properties["description"] += ', XP '+ number;                
                if(number >= 51) {
                  properties["rank"] = 'revered';  
                } else if(number >= 31) {
                  properties["rank"] = 'grizzled';  
                } else if(number >= 16) {
                  properties["rank"] = 'ace';  
                } else if(number >= 6) {
                  properties["rank"] = 'veteran';  
                } else {
                  console.log(number);
                  properties["rank"] = 'adapt';  
                }
              }              
              else if(SPECIALISM.includes(name)) {
                properties["specialism"] = name.toLowerCase();
              } 
            });

          $(this)
            .children("categories")
            .children("category")
            .each(function () {
              if ($(this).attr("primary") == "true") return;

              var name = $(this).attr("name");

              // Test if operative category is found from images
              properties["photo"] = suggestPhoto(
                name + " " + properties["name"],
                properties
              );
              properties["photo"] = suggestPhoto(name, properties);

              if (properties["primary_category"] == undefined) {
                properties["primary_category"] = name;
                properties["secondary_categories"] = "";
              } else {
                properties["secondary_categories"] += ", " + name;
              }
            });

          // Parse weapons
          const parseProfiles = function (self) {
            const ep = $(self).children("costs").children("cost");
            const cost = parseInt(ep.attr("value"));
            const isEquipment = cost > 0;
            if (isEquipment) properties["equipment"] = true;

            var rulecard = {
              operator: false,
              equipment: true,
              title: $(self).attr("name") + " (" + cost + " EP)",
              description: 'Equipment',
              weapons: [],
              unique_actions: [],
              abilities: [],
              rules: [],
              equipments: [],
              battleHonours: [],
              battleScars: []
            };
            
            // Print cost only once
            var costPrinted = false;

            // Battle Honours
            $(self)
              .children("profiles")
              .children('profile[typeName="Battle Honours"]')
              .each(function () {
                var data = {
                    title: $(this).attr("name"),                    
                  };                  
  
                $(this)
                  .children("characteristics")
                  .children("characteristic")
                  .each(function () {
                    data["description"] = $(this).text();
                    console.log(data['description']);
                  });
                battleHonours[data["title"]] = data;
                rulecard["battleHonours"].push(data);
              });
              
              // Battle Scars
              $(self)
                .children("profiles")
                .children('profile[typeName="Battle Scars"]')
                .each(function () {
                  var data = {
                      title: $(this).attr("name"),                    
                    };                  

                  $(this)
                    .children("characteristics")
                    .children("characteristic")
                    .each(function () {
                      data["description"] = $(this).text();
                      console.log(data['description']);
                    });
                  battleScars[data["title"]] = data;
                  rulecard["battleScars"].push(data);
              });

            // Basic weapon profiles
            $(self)
              .children("profiles")
              .children('profile[typeName="Weapons"]')
              .each(function () {
                var data = {
                  title: Helpers.removeParentheses($(this).attr("name")),
                  equipment: isEquipment,
                  cost: (isEquipment && !costPrinted ? " (" + cost + " EP)" : ""),
                };
                costPrinted = true;

                $(this)
                  .children("characteristics")
                  .children("characteristic")
                  .each(function () {
                    var characteristic =
                      $(this).attr("name") == "!"
                        ? "critical"
                        : Helpers.getRestfulURL($(this).attr("name"));
                    data["stats_" + characteristic] = $(this).text();
                  });
                properties["weapons"].push(data);
                rulecard["weapons"].push(data);
              });

            // Ability profiles
            $(self)
              .children("profiles")
              .children('profile[typeName="Abilities"]')
              .each(function () {
                var data = {
                  title: $(this).attr("name"),
                  equipment: isEquipment,
                  cost: (isEquipment && !costPrinted ? " (" + cost + " EP)" : ""),
                };
                costPrinted = true;

                $(this)
                  .children("characteristics")
                  .children("characteristic")
                  .each(function () {
                    data["description"] = $(this).text();
                  });
                abilities[Helpers.getRestfulURL(data["title"])] = data;
                rulecard["abilities"].push(data);
              });

            // Unique Action profiles
            $(self)
              .children("profiles")
              .children('profile[typeName="Unique Actions"]')
              .each(function () {
                var data = {
                  title: $(this).attr("name"),
                  equipment: isEquipment,
                  cost: (isEquipment && !costPrinted ? " (" + cost + " EP)" : ""),
                };
                costPrinted = true;

                $(this)
                  .children("characteristics")
                  .children("characteristic")
                  .each(function () {
                    data["description"] = $(this).text();
                  });
                actions[Helpers.getRestfulURL(data["title"])] = data;
                rulecard["unique_actions"].push(data);
              });

            // Equipment profiles
            $(self)
              .children("profiles")
              .children('profile[typeName="Equipment"]')
              .each(function () {
                var data = {
                  title: $(this).attr("name"),
                  equipment: isEquipment,
                  cost: (isEquipment && !costPrinted ? " (" + cost + " EP)" : ""),
                };
                costPrinted = true;

                $(this)
                  .children("characteristics")
                  .children("characteristic")
                  .each(function () {
                    data["description"] = $(this).text();
                  });
                equipments[Helpers.getRestfulURL(data["title"])] = data;
                rulecard["equipments"].push(data);
              });

            // Profile with special rules
            $(self)
              .children("rules")
              .children("rule")
              .each(function () {
                var data = {
                  title: $(this).attr("name"),
                  description: $(this).children("description").text(),
                  equipment: isEquipment,
                  cost: (isEquipment && !costPrinted ? " (" + cost + " EP)" : ""),
                };
                const rs = Helpers.getRestfulURL(data["title"]);
                // If there's already rule without equipment, skip this
                if (rs in rules && !rules[rs].equipment) return;
                rules[rs] = data;
                rulecard["rules"].push(data);
              });
           
            if (isEquipment) rulecards[Helpers.getRestfulURL(rulecard["title"])] = rulecard;
          };

          // Parse profiles below operative node
          parseProfiles(this);

          $(this)
            .children("selections")
            .children('selection[type="upgrade"]')
            .each(function () {
              // Parse profiles below any upgrade
              parseProfiles(this);

              // Parse profiles below any upgrade selection
              parseProfiles(
                $(this)
                  .children("selections")
                  .children('selection[type="upgrade"]')
              );
            });

          // Sanitize output
          for (var i in abilities) {
            properties["abilities"].push(abilities[i]);

            addRulecard(abilities[i].title, {
              description: 'Abilities',
              weapons: [],
              unique_actions: [],
              abilities: [abilities[i]],
              rules: [],
              equipments: [],
              battleHonours: [],
              battleScars: []
            });
          }
          for (var i in actions) {
            properties["unique_actions"].push(actions[i]);

            addRulecard(actions[i].title, {
              description: 'Unique Actions',
              weapons: [],
              unique_actions: [actions[i]],
              abilities: [],
              rules: [],
              equipments: [],
              battleHonours: [],
              battleScars: []
            });
          }
          for (var i in equipments) {
            properties["equipments"].push(equipments[i]);
          }
          for (var i in battleHonours) {
            properties["battleHonours"].push(battleHonours[i]);

            addRulecard(battleHonours[i].title, {
              description: 'Battle Honours',
              weapons: [],
              unique_actions: [],
              abilities: [],
              rules: [],
              equipments: [],
              battleHonours: [battleHonours[i]],
              battleScars: []
            });
          }
          for (var i in battleScars) {
            properties["battleScars"].push(battleScars[i]);

            addRulecard(battleScars[i].title, {
              description: 'Battle scars',
              weapons: [],
              unique_actions: [],
              abilities: [],
              rules: [rules[i]],
              equipments: [],
              battleHonours: [],
              battleScars: [battleScars[i]]
            });
          }
          for (var i in rules) {
            properties["rules"].push(rules[i]);

            addRulecard(rules[i].title, {
              description: 'Special rules',
              weapons: [],
              unique_actions: [],
              abilities: [],
              rules: [rules[i]],
              equipments: [],
              battleHonours: [],
              battleScars: []
            });
          }

          if (isOperative) datacards.push(Helpers.deepMap(properties, Helpers.replaceSymbols));
        });
    });

  for (let key of Object.keys(rulecards)) {
    id += 1;
    rulecards[key].id = id;
    datacards.push(rulecards[key]);
  }

  return datacards;
}

function readZipFile(id, f) {
  // Processing time counter
  var processingTimeStart = new Date();

  JSZip.loadAsync(f)
    .then(
      function (zip) {
        // Processing time
        var processingTimeEnd = new Date();
        console.log(
          "File read in " + (processingTimeEnd - processingTimeStart) + "ms"
        );

        var roster = null;

        zip.forEach(function (relativePath, zipEntry) {
          if (Helpers.getExtension(zipEntry.name) == ".ros") {
            // Found the roster. There should be only one file, but in case it's a custom zip, use first
            roster = zipEntry;
            return;
          }
          if (Helpers.getExtension(zipEntry.name) == ".html") {
            // Found the frame file.
            roster = zipEntry;
            return;
          }
        });

        if (roster) {
          // Return the promise
          return roster.async("text");
        } else {
          console.log("Uncompressed file, but roster was not found");
        }
      },
      function (e) {
        console.log("Error uncompressing " + f.name + ": " + e.message);
      }
    )
    .then(
      function success(content) {
        var xmlDoc = $.parseXML(content);
        var $xml = $(xmlDoc);

        if ($xml.find("force").length) {
          console.log("Found a roster file");
          renderDatacards(parseRoster($xml));
        } else if ($xml.find("img").length) {
          console.log("Found a images file");
          parseFramefile($xml);
        } else {
          console.log("Unknown file format");
        }
      },
      function error(e) {
        console.log(e);
      }
    );
}

// Render page
document.body.appendChild(renderHero());
document.body.appendChild(renderButtons());
document.body.appendChild(renderDatacardContainer());

renderDatacards(exampleCards, true);

// Activate dropzone
Helpers.registerDropzones("#dropzone", "#file", readZipFile);

// Activate size toggle
$("#toggle-datacards").on("click", function (event) {
  $(".avoid-break").each(function () {
    $(this).toggleClass("card-large");
    $(this).toggleClass("card-small");
  });
  if (large) {
    $("#toggle-datacards").html(TEXT_LARGE);
  } else { 
    $("#toggle-datacards").html(TEXT_SMALL);
  }
  large = !large;
});

// Activate card type toggle
$("#toggle-rulecards").on("click", function (event) {
  $(".operator-card").toggle();
  $(".rule-card").toggle();
  if (operatorcards) {
    $("#toggle-rulecards").html(TEXT_DATACARDS);
  } else {
    $("#toggle-rulecards").html(TEXT_RULECARDS);
  }
  Helpers.redrawStripedTables();
  operatorcards = !operatorcards;
});

// Activate print button
$("#print-datacards").click(function () {
  window.print();
  return false;
});
