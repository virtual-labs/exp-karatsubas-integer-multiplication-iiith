# Background

To multiply two n-digit numbers, you have to do $n^2$ single digit multiplications. That’s obvious — you have to multiply each digit of one number to each digit of the other one. There’s no way around it. When this was mentioned by Andrei Kolomogorov in a seminar in 1960 (as the Kolomogorov Conjecture), one of his students was audacious enough to not take it for granted.

This student was named Anatoly Karatsuba and he managed to find a faster way to multiply numbers before the seminar ended. His was the first algorithm to multiply numbers faster than multiplying them by the elementary school method, thus opening the floodgates for algorithm development and improvements in an area that everyone until then had considered done and solved.

# The Naive Algorithm

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

$xy = x_1y_1b^2 + (x_1y_0 + x_0y_1)b + x_0y_0$

</div>

Also note that $x = x_1 \times b^1 + x_0 \times b^0$, where $b$ is the base of the number system.

# Karatsuba's Algorithm

Karatsuba noticed that we can write the coefficient of $b$ (which involves 2 multiplications) in this way:

<div style="text-align:center">

$x_1​y_0​+x_0​y_1​=(x_1​+x_0​)(y_1​+y_0​)−x_1​y_1​−x_0​y_0$

</div>

On the face of it, we have increased the number of multiplications required in the coefficient of $xy$ to $3$. However, we are already computing $x_0y_0$ and $x_1y_1$ for the overall multiplication. Hence, only 1 extra multiplication needs to be computed.

This brings the number of multiplications down to $3$ from $4$, thereby speeding up the process (addition is much faster than multiplication). 

# Introducing Recursion

Uptil now, we have assumed $x_1$ and $x_0$ to be integers. We can also consider them to be (in the general case) the two halves of the number. 
$b$ is a suitable number.

With those definitions in mind, do three multiplications to calculate these three numbers:

<div style="text-align:center">

$z_2=x_1y_1$

$z_0=x_0y_0$

$z_1=(x_1+x_0)(y_1+y_0)−z_2−z_0$

</div>

And obtain the result:

<div style="text-align:center">

$xy=z_2​b^2+z_1​b+z_0​$

</div>

This is well and good, but how do we compute $z_1$? We can use the same algorithm recursively to compute $z_1$.

<div style="text-align:center">

$z_1= x_1y_1$

$=z_{12}b'^{2} + z_{11}b' + z_{10}$

where $b' = b/2$

</div>

This gives us the recurrence relation

<div style="text-align:center">

$T(n) = 3T(n/2) + O(n)$

</div>

which gives us a time complexity of $O(n^{log_2 3})$ &#x2248; $O(n^{1.59})$
(Refer to [this](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)) page for details on how to solve this recurrence relation).

The naive algorithm has a time complexity of $O(n^2)$, so this is a significant improvement.

Thus we have introduced an algorithm to speed up integer multiplication and used it to explain the concept of recursion.