var jso = new JSO({
        providerID: "chronotrack",
      	client_id: "6e42ab44",
	    redirect_uri: "http://localhost:8090/auth/callback",
	    authorization: "https://qa-api.chronotrack.com/oauth2/authorize",
	    scopes: { request: ["http://localhost:8090/auth/callback"]}
    });
JSO.enablejQuery($);
jso.ajax({
        url: "https://qa-api.chronotrack.com/api/event",
        oauth: {
            scopes: {
                request: ["https://qa-api.chronotrack.com/api/event"],
                require: ["https://qa-api.chronotrack.com/api/event"]
            }
        },
        dataType: 'json',
        success: function(data) {
            console.log("Response (google):");
            console.log(data);
            $(".loader-hideOnLoad").hide();
        }
    });