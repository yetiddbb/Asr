/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from wujianzhang
load dependency
"Asr": "file:../pxt-Asr"
*/

//% color="#006400" weight=20 icon="\uf130"
namespace Asr {
    const I2C_ADDR = 0x0f                   //语音识别模块地址
    const ASR_ADD_WORD_ADDR = 0x01          //词条添加地址
    const ASR_MODE_ADDR = 0x02              //识别模式设置地址，值为0-2，0:循环识别模式 1:口令模式 ,2:按键模式，默认为循环检测
    const ASR_RGB_ADDR = 0x03               //RGB灯设置地址,需要发两位，第一个直接为灯号1：蓝 2:红 3：绿 ,第二个字节为亮度0-255，数值越大亮度越高
    const ASR_REC_GAIN = 0x04               //识别灵敏度设置地址，灵敏度可设置为0x00-0x7f，值越高越容易检测但是越容易误判，建议设置值为0x40-0x55,默认值为0x40
    const ASR_CLEAR_ADDR = 0x05             //清除掉电缓存操作地址，录入信息前均要清除下缓存区信息,随意写0x00-0xff都可以清除
    const ASR_KEY_FLAG = 0x06               //用于按键模式下，设置启动识别模式
    const ASR_VOICE_FLAG = 0x07             //用于设置是否开启识别结果提示音
    const ASR_RESULT = 0x08                 //识别结果存放地址
    const ASR_BUZZER = 0x09                 //蜂鸣器控制寄存器，写1开启，写0关闭
    const ASR_NUM_CLECK =0x0a               //录入词条数目校验

    
    const DELAY  = 150;//I2C之间延时间隔ms

    export enum Mode {
        //% blockId="cycle_mode" block="cycle_mode"
        cycle_mode = 0,
        //% blockId="password_mode" block="password_mode"  
        password_mode = 1,
         //% blockId="key_mode" block="key_mode"        
        key_mode = 2
    }
    export enum Voice_State {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="ON" block="ON""
        ON = 1
    }

    export enum Buzzer_State {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="ON" block="ON""
        ON = 1
    }


    export enum enColor {

        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="Red" block="Red"
        Red,
        //% blockId="Green" block="Green"
        Green,
        //% blockId="Blue" block="Blue"
        Blue,
        //% blockId="White" block="White"
        White,
        //% blockId="Cyan" block="Cyan"
        Cyan,
        //% blockId="Pinkish" block="Pinkish"
        Pinkish,
        //% blockId="Yellow" block="Yellow"
        Yellow

    }

    function setPwmRGB(red: number, green: number, blue: number): void {

        let buf = pins.createBuffer(4);
        buf[0] = ASR_RGB_ADDR;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }



    //% blockId=Asr_Asr_Add_Words block="Asr_Add_Words|value %value|str %str"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Asr_Add_Words(value: number,str: string): void {
        let asr_txt = str;
        let num = asr_txt.length + 2;

        let buf = pins.createBuffer(num);
        buf[0] = ASR_ADD_WORD_ADDR;
        buf[1] = value;
        for(let i =2;i<num;i++)
        {
            buf[i] = asr_txt.charCodeAt(i-2);
        }

        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }

    //% blockId=Asr_Asr_Clear_Buffer block="Asr_Clear_Buffer"
    //% weight=97
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12    
    export function Asr_Clear_Buffer():void{
        let buf = pins.createBuffer(2);

        buf[0] = ASR_CLEAR_ADDR;
        buf[1] = 0x40;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);

        basic.pause(12000);//必须足够的延时用于擦除
    }

    //% blockId=Asr_Asr_Set_RGB block="Asr_Set_RGB|value1 %value1|value2 %value2|value3 %value3"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12  
    export function Asr_Set_RGB(value1: number, value2: number, value3: number): void {
        setPwmRGB(value1, value2, value3);
    }

    //% blockId=Asr_Asr_Set_RGB2 block="Asr_Set_RGB2|value %value"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Asr_Set_RGB2(value: enColor): void {

        switch (value) {
            case enColor.OFF: {
                setPwmRGB(0, 0, 0);
                break;
            }
            case enColor.Red: {
                setPwmRGB(255, 0, 0);
                break;
            }
            case enColor.Green: {
                setPwmRGB(0, 255, 0);
                break;
            }
            case enColor.Blue: {
                setPwmRGB(0, 0, 255);
                break;
            }
            case enColor.White: {
                setPwmRGB(255, 255, 255);
                break;
            }
            case enColor.Cyan: {
                setPwmRGB(0, 255, 255);
                break;
            }
            case enColor.Pinkish: {
                setPwmRGB(255, 0, 255);
                break;
            }
            case enColor.Yellow: {
                setPwmRGB(255, 255, 0);
                break;
            }
        }
    }


    //% blockId=Asr_Asr_Set_Mode block="Asr_Set_Mode|mode_num %mode_num"
    //% weight=99
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12  
    export function Asr_Set_Mode(mode_num: Mode): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_MODE_ADDR;
        buf[1] = mode_num;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }
    
    //% blockId=Asr_Asr_Gain block="Asr_Gain|gain %gain"
    //% weight=95
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12  
    export function Asr_Gain(gain: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_REC_GAIN;
        buf[1] = gain;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }
    
    //% blockId=Asr_Asr_Voice block="Asr_Voice|voice %voice"
    //% weight=94
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12 
    export function Asr_Voice(voice: Voice_State): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_VOICE_FLAG;
        buf[1] = voice;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }


    //% blockId=Asr_Asr_Buzzer block="Asr_Buzzer|buzzer_state %buzzer_state"
    //% weight=94
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12 
    export function Asr_Buzzer(buzzer_state: Buzzer_State): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_BUZZER;
        buf[1] = buzzer_state;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(10);
    }



    //% blockId=Asr_Asr_Key_ON block="Asr_Key_ON"
    //% weight=93
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12 
    export function Asr_Key_ON(): void {
        let buf = pins.createBuffer(2);
        buf[0] = ASR_KEY_FLAG;
        buf[1] = 1;
        
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);
    }


    //% blockId=Asr_Asr_Result block="Asr_Result"
    //% weight=92
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Asr_Result(): number {

        let buf = pins.createBuffer(1);
        buf[0] = ASR_RESULT;       
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);  

        let result = pins.i2cReadNumber(I2C_ADDR,NumberFormat.UInt8LE, false);
        return result;
    }
    
    //% blockId=Asr_Asr_NUM_Cleck block="Asr_NUM_Cleck"
    //% weight=91
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Asr_NUM_Cleck(): number {

        let buf = pins.createBuffer(1);
        buf[0] = ASR_NUM_CLECK;       
        pins.i2cWriteBuffer(I2C_ADDR, buf);
        basic.pause(DELAY);  

        let asr_num = pins.i2cReadNumber(I2C_ADDR,NumberFormat.UInt8LE, false);
        return asr_num;
    } 

    //% blockId=Cleck_Asr_Num block="Cleck_Asr_Num|asr_num %asr_num"
    //% weight=91
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Cleck_Asr_Num(asr_num: number): void { 
        
        while(Asr_NUM_Cleck() !=  asr_num)
        {
            basic.pause(50);
        }

}

 
}
