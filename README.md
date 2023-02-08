DRUM PATTERN GENERATOR

AUTHORS: Brusca Alfredo, Marazzi Alice, Pomarico Riccardo

When we decided to develop the Drum Pattern Generator we all had in mind the goal of this software: provide the user with an effective tool that could help with the writing process of a new musical piece. It can automatically generate new patterns through the aid of elements such as kick, snare, high hat, and cymbal. We also added what we called ghost snare, which is the snare playing the ghost notes. The user can continue creating new patterns, by setting some parameters such as the BPM, the level of complexities and the time signature, until a liking pattern is provided.

We added an interactive drum kit that can be played either by clicking on the instruments or using the corresponding keys on the keyboard and that can help the user to visualize the pattern created by the generator, playing it as it is generated. Using the interactive drum kit the user can also choose how the different instrument sound, picking what they prefer among several samples in the database, creating a variety of sound combinations.

We decided to implement a system that could provide the user with a clear way to let them able to follow the generated pattern even visually, therefore we have the possibility of understanding which elements are played at which moment. In this way, we can easily reproduce the sound pattern even live with a real drum.
In the interface, we can see 4 tables, each of which refers to a different measure. Next to each table is marked a number indicating the number of subdivisions present for that specific measure, which will correspond to the number of cells present for each row of the table. 
The different lines, in fact, correspond to ghost snare, cymbal, kick, snare, and high hat, and when the relative element to that specific subdivision is played, the cell will appear colored.

When the complexity is set to 1 a pattern is generated based on the parameters provided. There is not much of a complexification between different measures, and the only elements changing are the kick and the snare, with an additional change in the ghost snare pattern for measure 4.
When the complexity is set to 2 a polyrhytm is introduced as the hi-hat has a different subdivision from the other elements.
When the complexity is set to 3 an hidden layer of complexity is added by keeping the kick and the snare constant while changing the subdivision between them.
When the complexity is set to 4 the accents gets slightly delayed, introducing a new time signature, and the subdivision are changed to hide the musical difference between the two time signature.
