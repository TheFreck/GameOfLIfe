


namespace GameOfLife.Server
{
    public static class Life
    {
        public static bool[][] PadLife(bool[][] input)
        {
            var output = new bool[input.Length+2][];
            for(var i=0; i<output.Length; i++) 
            {
                output[i] = new bool[input[0].Length+2];
                for(var j=0; j < output[i].Length; j++)
                {
                    if (i==0 || i > input.Length || j==0 || j > input[0].Length)
                    {
                        output[i][j] = false;
                    }
                    else 
                    {
                        output[i][j] = input[i-1][j-1];
                    }
                }
            }
            return output;
        }

        public static int[][] CountNeighbors(bool[][] input)
        {
            var output = new int[input.Length][];
            for(var i=0; i < output.Length; i++)
            {
                output[i] = new int[input[i].Length];
                for(var j=0; j < input[i].Length; j++)
                {
                    for(var k=i-1; k<=i+1; k++)
                    {
                        for(var l=j-1; l<=j+1; l++)
                        {
                            if ((k!=i || l!=j) && k>=0 && l>=0 && k<input.Length && l < input[0].Length && input[k][l] != null && input[k][l])
                            {
                                output[i][j]++;
                            }
                        }
                    }
                }
            }
            return output;
        }

        public static bool[][] Proceed(bool[][] input)
        {
            if(input?.Length > 0)
            {
                var paddedLife = PadLife(input);
                var countedLife = CountNeighbors(paddedLife);
                var life = DetermineLifeAndDeath(countedLife, paddedLife);
                return UnPadLife(life);
            }
            return input;
        }

        public static bool[][] UnPadLifeVertical(bool[][] input)
        {
            var output = new bool[input.Length - 2][];
            for (var i = 0; i < output.Length; i++)
            {
                output[i] = input[i + 1];
            }
            return output;
        }

        public static bool[][] FlipLife(bool[][] input)
        {
            var flipped = new bool[input[0].Length][];
            for (var i = 0; i < input[0].Length; i++)
            {
                flipped[i] = new bool[input.Length];
                for (var j = 0; j < input.Length; j++)
                {
                    flipped[i][j] = input[j][i];
                }
            }
            return flipped;
        }

        public static bool[][] UnPadLife(bool[][] input)
        {
            return input.Length > 0 ? FlipLife(UnPadLifeVertical(FlipLife(UnPadLifeVertical(input)))) : input;
        }

        public static bool[][] DetermineLifeAndDeath(int[][] inputCount, bool[][] inputLife)
        {
            var output = new bool[inputCount.Length][];
            for(var i=0; i< inputCount.Length; i++)
            {
                output[i] = new bool[inputLife[0].Length];
                for(var j=0; j < inputCount[i].Length; j++)
                {
                    if (inputLife[i][j] && (inputCount[i][j] == 2 || inputCount[i][j] == 3))
                    {
                        output[i][j] = true;
                    }
                    else if(!inputLife[i][j] && inputCount[i][j] == 3)
                    {
                        output[i][j] = true;
                    }
                    else
                    {
                        output[i][j] = false;
                    }
                }
            }
            return output;
        }

        public static bool[][][] ProceedMany(bool[][] input, int count)
        {
            var generations = new bool[count][][];
            generations[0] = input;
            for(var i=1; i < count; i++)
            {
                generations[i] = Proceed(generations[i - 1]);
            }
            return generations.Where(m => m != generations[0]).ToArray();
        }
    }
}
