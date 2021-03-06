enum SoundType {
    SoundEffect='se',
    BackgroundMusic='bgm',
    BackgroundEffect='bge'
}


export default class TSound{
	static seVolume:float=1;
	static bgmVolume:float=1;
	static fileType=['.mp3','.wav'];

    static SoundType = SoundType;

	static seList:PIXI.sound.Sound[]=[];
	static currBgm?:PIXI.sound.Sound;
	static lastBgm?:PIXI.sound.Sound;
	static bgmFadeAcc:float=1;
	static bgmFadeTarget:float=1;

	static play(type:string,_args:string[],_basepath:string){
		for(const ft of TSound.fileType){
			let filepath=_basepath+_args[1]+ft
			if(PIXI.Loader.shared.resources[filepath]){
				if(_args[0]==SoundType.SoundEffect){
					TSound.playSE(filepath)
				}else if(_args[0]==SoundType.BackgroundMusic){
					TSound.playBGM(filepath)
				}
				//*remove after played?
			}
		}
	}

	static reuseKey:int[]=[];
	static clearTimer:float=0;
	static initTicker(ticker:PIXI.Ticker){
		ticker.add((delta:float)=>{
			TSound.clearTimer+=delta
			if(TSound.clearTimer>60*5){
				TSound.destroyEnded()
				TSound.clearTimer=0;
			}
			//*fadein/out sound
			//bgmFadeAcc
		})
	}

	//bgm

	

	static playBGM(filepath:string){
		TSound.stopBGM()
		TSound.currBgm=PIXI.sound.Sound.from(filepath);
		TSound.currBgm.volume=TSound.bgmVolume;
		TSound.currBgm.loop=true;
		TSound.currBgm.play()
		//*fade in/out
	}

	static stopBGM(){
		if(TSound.currBgm){
			TSound.currBgm.stop();
			TSound.currBgm.destroy();
			TSound.currBgm=undefined;
		}
	}

	//se

	static playSE(filepath:string):PIXI.sound.Sound{
		let s=PIXI.sound.Sound.from(filepath);
		if(TSound.reuseKey.length>0){
			TSound.seList[TSound.reuseKey.shift()!]=s;
		}else{
			TSound.seList.push(s);
		}
		s.play();
		s.volume=TSound.seVolume
		return s;
	}

	static destroyEnded(){
		for(let k in TSound.seList){
			if(!TSound.seList[k].isPlaying){
				TSound.seList[k].destroy();
				delete TSound.seList[k];
				TSound.reuseKey.push(Number(k));
			}
		}
	}

	static stopAllSE(){
		for(let k of TSound.seList){
			if(k){
				k.stop();
				k.destroy();
			}
		}
		TSound.reuseKey=[];
		TSound.seList=[];
	}

	//all sound

	static stopAllSound(){
		TSound.stopAllSE()
		TSound.stopBGM()

		PIXI.sound.stopAll();
		PIXI.sound.removeAll();
	}

	static pauseAll(){
		for(let k of TSound.seList){
			if(k){
				k.pause();
			}
		}
		if(TSound.currBgm){
			TSound.currBgm.pause();
		}
	}

	static resumeAll(){
		for(let k of TSound.seList){
			if(k && k.paused){
				k.play();
			}
		}
		if(TSound.currBgm){
			TSound.currBgm.resume();
		}
	}
}

/**
 * to do:
 * background se
 * face in/out next bgm
 * left right,volume
*/