import type { MediaQueryObject } from "@hanzo/gui-web";
/**
* @deprecated you no longer need to call createMedia or import @hanzo/gui-react-native-media-driver at all.
* Hanzo GUI now automatically handles setting this up, you can just pass a plain object to createGui.
*/
export declare function createMedia<A extends {
	[key: string]: MediaQueryObject;
}>(media: A): A;

//# sourceMappingURL=createMedia.d.ts.map