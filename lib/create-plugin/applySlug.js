"use strict";
var __spreadArrays =
    (this && this.__spreadArrays) ||
    function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
        return r;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
var path_1 = require("path");
var fs_1 = require("fs");
/**
 * Apply the slug to different files where needed. Also apply the main root slug
 * in the plugin so the utils package for example can be correctly linked and resolved.
 *
 * Additionally change the name of the initial .pot file because it also relies on the slug.
 *
 * @param workspace
 * @param createPluginCwd
 * @param slug
 */
function applySlug(workspace, createPluginCwd, slug) {
    utils_1.logProgress(
        "Find various code places and replace the slug with " + chalk_1.default.underline(slug) + "..."
    );
    var globFiles = function(pattern) {
        return glob_1.default.sync(pattern, { cwd: createPluginCwd, absolute: true });
    };
    var files = __spreadArrays(
        globFiles("devops/**/*.{yml,sh}"),
        globFiles("devops/.gitlab/**/*.yml"),
        globFiles("devops/.gitlab/.gitlab-ci.yml"),
        globFiles("package.json"),
        globFiles("src/**/*.php")
    );
    utils_1.searchAndReplace(files, /wp-reactjs-starter/g, slug);
    // Get root name and replace wp-reactjs-multi-starter
    utils_1.logProgress(
        "Find various code places and replace the root package name with " +
            chalk_1.default.underline(workspace) +
            "..."
    );
    var multiStarterFiles = __spreadArrays(globFiles("src/public/ts/**/*.tsx"), globFiles("package.json"));
    utils_1.searchAndReplace(multiStarterFiles, /wp-reactjs-multi-starter/g, workspace);
    // i18n .pot files
    var phpPotFolder = path_1.resolve(createPluginCwd, "src/languages");
    var tsPotFolder = path_1.resolve(createPluginCwd, "src/public/languages");
    fs_1.renameSync(
        path_1.resolve(phpPotFolder, "wp-reactjs-starter.pot"),
        path_1.resolve(phpPotFolder, slug + ".pot")
    );
    fs_1.renameSync(path_1.resolve(tsPotFolder, "wp-reactjs-starter.pot"), path_1.resolve(tsPotFolder, slug + ".pot"));
}
exports.applySlug = applySlug;