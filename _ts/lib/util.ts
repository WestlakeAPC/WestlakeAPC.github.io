/**
 * Created by ethertyper on 10/18/16.
 */

export class greeting {
    public static something: String = "Steven is awesome and helps me do gulp!";
}

(function subscribe() {
    let channels = ["AnimatorJoe", "Eli Bradley"];

    /* Fancy robo-magic */

    channels.forEach(channel => console.log(`Now autosubscribed to ${channel}'s channel.`));
    console.log("JK but totally subscribe to them.");
})();