# Background

To multiply two n-digit numbers, you have to do $n^2$ single digit multiplications. That’s obvious — you have to multiply each digit of one number to each digit of the other one. There’s no way around it. When this was mentioned by Andrei Kolomogorov in a seminar in 1960 (as the Kolomogorov Conjecture), one of his students was audacious enough to not take it for granted.

This student was named Anatoly Karatsuba and he managed to find a faster way to multiply numbers before the seminar ended. His was the first algorithm to multiply numbers faster than multiplying them by the elementary school method, thus opening the floodgates for algorithm development and improvements in an area that everyone until then had considered done and solved.

# The Algorithm

<div style="text-align: right">

$26$<br/>
 $\times  42$

---
$6 \times 3 =  18$
<br/>
$6 \times 4 =  24$ 
<br/>
$2 \times 3 =  6 $
<br/>
$2 \times 4 =  8 $

---
$6 \times 10^2 + (24+8)\times 10^1 + 18 = 1188$ 

</div>

That’s four single-digit multiplications, which is the same thing as two-squared. 

OK, let’s switch to something more abstract. Denote the first number by $x$ and its digits by $x1$​ and $x0$​. Similarly the second number will be represented by $y$ and we obtain this:

<div style="text-align:center">

$x_1​y_0​+x_0​y_1​=(x_1​+x_0​)(y_1​+y_0​)−x_1​y_1​−x_0​y_0$ &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; ($1$)

</div>

Also note that $x = x_1 \times b^1 + x_0 \times b^0$, where $b$ is the base of the number system.

