var jso = new JSO({
        providerID: "chronotrack",
      	client_id: "6e42ab44",
	    redirect_uri: "http://localhost:8090",
	    authorization: "https://api.chronotrack.com/oauth2/authorize"
    });
JSO.enablejQuery($);
jso.ajax({
        url: "https://api.chronotrack.com/api/event/20409t",
        oauth: {
            scopes: {
                request: ["https://api.chronotrack.com/api/event"],
                require: ["https://api.chronotrack.com/api/event"]
            }
        },
        dataType: 'json',
        success: function(data) {
            console.log("Response (google):");
            console.log(data);
            $(".loader-hideOnLoad").hide();
        }
    });
