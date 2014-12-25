"use strict";

define([window.isTest ? "react-dev" : "react", "util", "models", "apiclient", "storage"],
        function(React, Util, models, APIClient, Storage) {
    var cx = React.addons.classSet;

    /**
     * Represents a single exercise, it will load the exercise dynamically and
     * display it to the user.
     */
    var ExerciseViewer = React.createClass({
        propTypes: {
            exercise: React.PropTypes.object.isRequired
        },
        mixins: [Util.BackboneMixin],
        getBackboneModels: function() {
            return [this.props.exercise];
        },
        getInitialState: function() {
            return { };
        },
        componentWillMount: function() {
        },
        componentDidMount: function() {
        },
        componentWillUnmount: function() {
        },
        render: function() {
            if (this.state.error) {
                return <div>Could not load exercise</div>;
            } else if (this.props.exercise.isKhanExercisesExercise()) {
                var path = `/khan-exercises/exercises/${this.props.exercise.getFilename()}`;
                return <iframe src={path}/>;
            }
            Util.log("render exercise: :%o", this.props.exercise);
            return <div>TODO: Render exercise :)</div>;
        }
    });

    return {
        ExerciseViewer,
    };
});