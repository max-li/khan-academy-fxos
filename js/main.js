/**
 * @jsx React.DOM
 */

"use strict";

define(["react", "models", "ka", "storage"], function(React, models, KA, Storage) {
    var cx = React.addons.classSet;

    function partial( fn /*, args...*/) {
      var aps = Array.prototype.slice;
      var args = aps.call(arguments, 1);
      return function() {
        return fn.apply(this, args.concat(aps.call(arguments)));
      };
    }

    var DomainColorMap = {
        "new-and-noteworthy": "#ffffff",
        "math": "#156278",
        "science": "#822F3D",
        "economics-finance-domain": "#BB7B31",
        "humanities": "#C43931",
        "computing": "#568F3D",
        "test-prep": "#512D60",
        "partner-content": "#399B7C",
        "talks-and-interviews": "#3C5466",
        "coach-res": "#3C5466",
        "::app-search": "#3C5466"
    };

    var TopicItem = React.createClass({
        getInitialState: function() {
            return {};
        },
        render: function() {
            var topicClassObj = {
                'topic-item': true
            };
            var parentDomain = this.props.topic.getParentDomain();
            topicClassObj[parentDomain.get("id")] = true;
            var topicClass = cx(topicClassObj);

            var divStyle = {
                float: "left;",
                width: "12px;",
                height: "100%",
                backgroundColor: DomainColorMap[this.props.topic.get("slug")]
            };
            return <li className={topicClass}>
                { this.props.topic.isRootChild() ? <div style={divStyle}/> : null }
                <a href="#" onClick={partial(this.props.onClickTopic, this.props.topic)}>
                    <p className="topic-title">{this.props.topic.get("title")}</p>
                </a>
            </li>;
        }
    });

    var VideoItem = React.createClass({
        //console.log('inside video node: ' + this.props.completed);
        render: function() {
            var videoNodeClass = cx({
              'video-node': true,
              'completed': this.props.completed
            });
            var pipeClassObj = {
                'pipe': true,
                'completed': this.props.completed
            };
            var subwayIconClassObj = {
                'subway-icon': true
            };
            var videoClassObj = {
                'video-item': true
            };
            var parentDomain = this.props.video.getParentDomain();
            subwayIconClassObj[parentDomain.get("id")] = true;
            videoClassObj[parentDomain.get("id")] = true;
            pipeClassObj[parentDomain.get("id")] = true;
            var subwayIconClass = cx(subwayIconClassObj);
            var pipeClass = cx(pipeClassObj);
            var videoClass = cx(videoClassObj);
            return <li className={videoClass}>
                <div className={subwayIconClass}>
                    <a href="#" onClick={partial(this.props.onClickVideo, this.props.video)}>
                        <div className={videoNodeClass}/>
                    </a>
                    <div className={pipeClass}/>
                </div>
                <a href="#" onClick={partial(this.props.onClickVideo, this.props.video)}>
                    <p className="video-title">{this.props.video.get("title")}</p>
                </a>
            </li>;
        }
    });

    var ArticleItem = React.createClass({
        render: function() {
            var articleNodeClass = cx({
              'article-node': true,
              'completed': this.props.completed
            });
            var pipeClassObj = {
                'pipe': true,
                'completed': this.props.completed
            };
            var subwayIconClassObj = {
                'subway-icon': true
            };
            var articleClassObj = {
                'article-item': true
            };
            var parentDomain = this.props.article.getParentDomain();
            subwayIconClassObj[parentDomain.get("id")] = true;
            articleClassObj[parentDomain.get("id")] = true;
            pipeClassObj[parentDomain.get("id")] = true;
            var subwayIconClass = cx(subwayIconClassObj);
            var pipeClass = cx(pipeClassObj);
            var articleClass = cx(articleClassObj);
            return <li className={articleClass}>
                <div className={subwayIconClass}>
                    <a href="#" onClick={partial(this.props.onClickArticle, this.props.article)}>
                        <div className={articleNodeClass}/>
                    </a>
                    <div className={pipeClass}/>
                </div>
                <a href="#" onClick={partial(this.props.onClickArticle, this.props.article)}>
                    <p className="article-title">{this.props.article.get("title")}</p>
                </a>
            </li>;
        }
    });

    var BackButton = React.createClass({
        render: function() {
            return <div>
                <a className="icon-back-link " href="#" onClick={partial(this.props.onClickBack, this.props.model)}>
                    <span className="icon icon-back">Back</span>
                </a>
            </div>;
        }
    });

    var MenuButton = React.createClass({
        render: function() {
            return <div>
                <menu type="toolbar" className="icon-menu-link ">
                    <a href="#main-content">
                        <span className="icon icon-menu">Menu</span>
                    </a>
                </menu>
            </div>;
        }
    });

    var TopicViewer = React.createClass({
        componentDidMount: function() {
        },
        render: function() {
            if (this.props.topic.get("topics")) {
                var topics = _(this.props.topic.get("topics").models).map((topic) => {
                    return <TopicItem topic={topic}
                                      onClickTopic={this.props.onClickTopic}
                                      key={topic.get("slug")}/>;
                });
            }

            if (this.props.topic.get("contentItems")) {
                var contentItems = _(this.props.topic.get("contentItems").models).map((contentItem) => {
                    var completed = KA.completedVideos.indexOf(contentItem.get("id")) !== -1;//todo articles
                    if (contentItem.isVideo()) {
                        return <VideoItem video={contentItem}
                                          onClickVideo={this.props.onClickContentItem}
                                          key={contentItem.get("slug")} completed={completed} />;
                    }
                    return <ArticleItem article={contentItem}
                                      onClickArticle={this.props.onClickContentItem}
                                      key={contentItem.get("slug")} completed={completed} />;
                });
            }

            var topicList = <section data-type="list">
                            <ul>
                            {topics}
                            {contentItems}
                            </ul>
                    </section>;
            return <div>
                    {topicList}
            </div>;
        }
    });

    var ContentListViewer = React.createClass({
        render: function() {
            if (this.props.collection.models) {
                var contentItems = _(this.props.collection.models).map((contentItem) => {
                    if (contentItem.isVideo()) {
                        return <VideoItem video={contentItem}
                                          onClickVideo={this.props.onClickContentItem}
                                          key={contentItem.get("slug")}/>;
                    }
                    return <ArticleItem article={contentItem}
                                      onClickArticle={this.props.onClickContentItem}
                                      key={contentItem.get("slug")}/>;
                });
            }

            var topicList = <section data-type="list">
                <ul>
                    {contentItems}
                </ul>
            </section>;

            return <div>
                    {topicList}
            </div>;
        }
    });

    var TranscriptItem = React.createClass({
        render: function() {
            var startMinute = this.props.transcriptItem.start_time / 1000 / 60 | 0;
            var startSecond = this.props.transcriptItem.start_time / 1000 % 60 | 0;
            startSecond = ("0" + startSecond).slice(-2);
            return <li>
                <a href="#" onClick={partial(this.props.onClickTranscript, this.props.transcriptItem)}>
                    <span>{startMinute}:{startSecond}</span>
                    <span>{this.props.transcriptItem.text}</span>
                </a>
            </li>;
        }
    });
    var TranscriptViewer = React.createClass({
        render: function() {
            if (!this.props.collection) {
                return null;
            }
            var transcriptItems = _(this.props.collection).map((transcriptItem) => {
                return <TranscriptItem transcriptItem={transcriptItem}
                                       key={transcriptItem.start_time}
                                       onClickTranscript={this.props.onClickTranscript} />;
            });
            return <ul className='transcript'>{transcriptItems}</ul>;
        }
    });

    var ArticleViewer = React.createClass({
        componentWillMount: function() {
            KA.getArticle(this.props.article.id).done((result) => {
                console.log('we got a result:');
                console.log(result);
                this.setState({content: result.translated_html_content});
            });
        },
        getInitialState: function() {
            return {};
        },
        render: function() {
            console.log("render article: ");
            console.log(this.props.article);
            if (this.state.content) {
                return <article dangerouslySetInnerHTML={{
                    __html: this.state.content
                }}/>

            }
            return null;
        }
    });

    var VideoViewer = React.createClass({
         componentWillMount: function() {
            KA.getVideoTranscript(this.props.video.get("youtube_id")).done((transcript) => {
                this.setState({transcript: transcript});
            });
        },
        onClickTranscript: function(obj) {
            var startSecond = obj.start_time / 1000 % 60 | 0;
            var video = this.refs.video.getDOMNode();
            video.currentTime = startSecond;
            video.play();
        },
        getInitialState: function() {
            return { };
        },
        componentDidMount: function() {
            // Add an event listener to track watched time
            var video = this.refs.video.getDOMNode();
            video.addEventListener("timeupdate",
                    function(e) {
                        var video = e.target;
                        var currentSecond = video.currentTime | 0;
                        var totalSeconds = video.duration | 0;
                        console.log('current second: ' + currentSecond + ' of ' + totalSeconds);
                    }, true);
        },
        render: function() {
            var transcriptViewer;
            if (this.state.transcript) {
                 transcriptViewer = <TranscriptViewer collection={this.state.transcript}
                                                      onClickTranscript={this.onClickTranscript} />;
            }
            return <div>
                 <video ref="video" width="320" height="240" controls>
                    <source src={this.props.video.get("download_urls").mp4} type="video/mp4"/>
                 </video>
                {transcriptViewer}
            </div>;
        }
    });

    var AppHeader = React.createClass({
        render: function() {
                var backButton;
                if (this.props.model.get("parent") ||
                        this.props.model.isContentList()) {
                    backButton = <BackButton model={this.props.model}
                                             onClickBack={this.props.onClickBack}/>;
                }

                var parentDomain = this.props.model.getParentDomain();
                var style;
                if (parentDomain) {
                    var domainColor = DomainColorMap[parentDomain.get("slug")];
                    if (domainColor) {
                        style = {
                            backgroundColor: domainColor
                        };
                    }
                }

                var title = "Khan Academy";
                if (this.props.model.get("title")) {
                    title = this.props.model.get("title");
                } else if (this.props.model.isContentList()) {
                    title = "Search";
                }

                return <header className="fixed" style={style}>
                        {backButton}
                        <MenuButton/>
                        <h1 className="header-title">{title}</h1>
                    </header>;
        }
    });


    var Search = React.createClass({
        getInitialState: function() {
            return {value: ''};
        },
        componentWillReceiveProps: function() {
            this.state.value = '';
        },
        onChange: function(event) {
            var search = event.target.value;
            this.setState({value: search});
            this.props.onSearch(search);
        },
        render: function() {
            var style = {
                width: "100%",
                height: "3em;",
                position: "relative"
            };
            var text = "Search...";
            if (this.props.model.get("title")) {
                text = "Search " + this.props.model.get("title");
            }
            return <div>
                <input type="text"
                       placeholder={text}
                       value={this.state.value}
                       required=""
                       style={style}
                       onChange={this.onChange}/>
            </div>;

        }
    });

    var Sidebar = React.createClass({
        render: function() {
            var items = [];
            if (KA.isLoggedIn()) {
                items.push(<li><a href="#" onClick={this.props.onClickProfile}>Profile</a></li>);
                items.push(<li><a href="#" onClick={this.props.onClickSignout}>Sign out</a></li>);
            } else {
                items.push(<li><a href="#" onClick={this.props.onClickSignin}>Sign in</a></li>);
            }
            items.push(<li><a href="#" onClick={this.props.onClickDownloads}>Downloads</a></li>);

            return <section data-type="sidebar">
                <header>
                    <menu type="toolbar">
                        <a href="#">Done</a>
                    </menu>
                    <h1>Options</h1>
                </header>
                <nav>
                    <ul>
                        {items}
                    </ul>
                </nav>
            </section>;
        }
    });

    var MainView = React.createClass({
        getInitialState: function() {
            return {
                currentModel: this.props.model
            };
        },
        onClickContentItem: function(model) {
            this.setState({currentModel: model});
        },
        onClickTopic: function(model) {
            this.setState({currentModel: model});
        },
        onClickBack: function(model) {
            if (this.state.currentModel.isContentList()) {
                return this.onSearch("");
            }
            this.setState({currentModel: model.get("parent")});
        },
        onClickSignin: function() {
            KA.login();
            this.forceUpdate();
        },
        onClickSignout: function() {
            KA.logout();
            this.forceUpdate();
        },
        onClickProfile: function() {
            console.log('Click profile');
        },
        onClickDownloads: function() {
            console.log('Click downloads');
        },
        onSearch: function(search) {
            if (!search) {
                this.setState({"currentModel": this.state.searchingModel, searchingModel: null});
                return;
            }
            var searchingModel = this.state.searchingModel;
            if (!searchingModel) {
                searchingModel = this.state.currentModel;
            }
            var results = searchingModel.findContentItems(search);
            var contentList = new models.ContentList(results);
            this.setState({"currentModel": contentList, searchingModel: searchingModel});
        },
        render: function() {
            var control;
            if (this.state.currentModel.isTopic()) {
                control = <TopicViewer topic={this.state.currentModel}
                                       onClickTopic={this.onClickTopic}
                                       onClickContentItem={this.onClickContentItem}/>;
            } else if (this.state.currentModel.isContentList()) {
                control = <ContentListViewer collection={this.state.currentModel}
                                             onClickContentItem={this.onClickContentItem} />;
            } else if (this.state.currentModel.isVideo()) {
                control = <VideoViewer  video={this.state.currentModel}/>;
            } else if (this.state.currentModel.isArticle()) {
                control = <ArticleViewer  article={this.state.currentModel}/>;
            } else {
                console.error("Unrecognized content item!");
            }

            var search;
            if (!this.state.currentModel.isContent()) {
                search = <Search model={this.state.currentModel}
                                 onSearch={this.onSearch}/>;
            }

            return <section className="current" id="index" data-position="current">
                <Sidebar onClickSignin={this.onClickSignin}
                         onClickSignout={this.onClickSignout}
                         onClickProfile={this.onClickProfile}
                         onClickDownloads={this.onClickDownloads}/>
                <section id="main-content" role="region" className="skin-dark">
                    <AppHeader model={this.state.currentModel}
                               onClickBack={this.onClickBack}
                               onSearch={this.onSearch}/>
                        {search}
                        {control}
                </section>
            </section>;
        }
    });

    /*
    // I thought this was supposed to be needed, but it seems to not be needed
    $.ajaxSetup({
        xhr: function() {return new window.XMLHttpRequest({mozSystem: true});}
    });
    */

    var mountNode = document.getElementById("app");

    // Init everything
    $.when(Storage.init(), KA.init()).done(function(topicData) {
        KA.getTopicTree().done(function(topicTreeData) {
            var topic = new models.TopicModel(topicTreeData, {parse: true});
            React.renderComponent(<MainView model={topic}/>, mountNode);
            Storage.readText("data.json").done(function(data) {
                console.log('read: ' + data);
            });
            if (KA.isLoggedIn()) {
                KA.getUserVideos().done(function(data) {
                    console.log("getUserVideos:");
                    console.log(data);
                });
            } else {
                console.log('Not logged in!');
            }

            // TODO: remove, just for easy inpsection
            window.topic = topic;
            window.KA = KA;
            window.React = React;
        });
     });
});
