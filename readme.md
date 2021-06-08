# LoRa Air-Time Calculator

A Calculator that calculate the time on air of LoRa packet. Based on the formula in Semtech's datasheet.

**TL;DR: This calculator is for pure LoRa modem, not for LoRaWAN. The demo is avaliable [here](https://iftnt.github.io/lora-air-time/index.html).**

LoRa is a exteremely powerful modulation method that can transmit data over 3km away. But one of the down side of LoRa is the very long, up to a few milliesecond, symbol time. Result in the very long time on air of the packet. Thus, calculating the total time on air is crutial for designing the timing of upper layer protocol.
However, the tool to calculate air-time provided by Semtech is only avaliable on Windows operation system. Moreover, most of the calculator tha I had found aim to LoRaWAN, not for pure LoRa. As a result, this little project was borned. It's my pleasure that this tool also helped you :)

## Screenshot

![Screenshot of the calculator](https://i.imgur.com/x1Wgolp.png)

## About the time on air of LoRa packet

The symbol time of LoRa Modulation follows this equation:  
![Equation to calculate symbol time](http://mathurl.com/render.cgi?T_s%3D%5Cfrac%7B2%5E%7BSP%7D%7D%7BBW%7D%5Cnocache)  
Where SP means _Spreading Factor_, and BW stands for _Bandwidth_.  
Once we have the symbol time, we can calculate the total time on air via the following equation:  
![Equation to calculate the time on air](http://mathurl.com/render.cgi?T_%7Bpacket%7D%3DT_s*%5B%28n_%7Bpreamble%7D+4.25%29+n_%7Bpayload%7D%5D%5C%5C%0An_%7Bpayload%7D%3D8+max%28ceil%28%5Cfrac%7B8PL-4SF+28+16CRC-20IH%7D%7BSF-2DE%7D%29*%28%5Cfrac%7BCR+4%7D%7B4%7D%29%2C0%29%5Cnocache)  
This equation have so many magic number that is not specified in the datasheet. Anyway, the result had been confirmed by the Semtech who knows all of the detail inside the blackbox. So, let's just write a calculator to calculate it!

## Validation of Correctness

I was wondering whether the air-time had been given in the datasheet is correct. So I performed the following experiment to validate the correctness of this calculator.  
I use USRP-B210 software-defined-radio and [gqrx](https://gqrx.dk/) to capture the raw I/Q data of LoRa signal transmitted by SX1276 at 920MHz unlicensed band. Then analysis it with [inspectrum](https://github.com/miek/inspectrum). The overall result provide an excellent prove to the correctness of calculator which is a good news for me. The detailed result is shown as below.

### Bandwidth=125KHz, Spreading Factor=7

The following image shows the ToA of payload. With 11bytes payload and 4/8 coding rate.  
The result of calculation is 32symbols and 1.024ms symbol time, which matchs the truth.  
![Payload ToA. BW125, SF7, CR4/8, 11 Bytes payload.](https://i.imgur.com/gN2VJPf.png)

The following image shows the ToA of payload. With 11bytes payload, CRC checksum, and explict header. Encoded with 4/8 coding rate.
The result of calculation is 40symbols and 1.024ms symbol time, which matchs the truth.  
![Payload ToA. BW125, SF7, CR4/8, 11 Bytes payload with CRC and explicit header.](https://i.imgur.com/BwhA6LZ.png)

### Bandwidth=125KHz, Spreading Factor=12

The following image shows the ToA of whole packet, preamble and payload. With 11bytes payload and 6preamble. Encoded with 4/6 coding rate.  
The calculated ToA is 794.624ms, 335.872ms, and 458.752ms respectively; which also matchs the measured result.  
![Packet ToA. BW125, SF12, CR4/6, 6 Preamble symbols, 11 Bytes payload.](https://i.imgur.com/dkOYFFP.png)
![Preamble ToA. BW125, SF12, CR4/6, 6 Preamble symbols.](https://i.imgur.com/WmgFipm.png)
![Payload ToA. BW125, SF12, CR4/6, 11 Bytes payload.](https://i.imgur.com/t1PiTPU.png)
P.S: The ToA of preamble measured in the above figure is only measured 10symbols. But there is actually 10.25symbols.

## Reference

1. [The datasheet of SX1276 LoRa Modem](https://semtech.my.salesforce.com/sfc/p/#E0000000JelG/a/2R0000001Rbr/6EfVZUorrpoKFfvaF_Fkpgp5kzjiNyiAbqcpqh9qSjE)
