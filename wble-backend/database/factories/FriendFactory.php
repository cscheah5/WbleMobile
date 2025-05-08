<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Friend>
 */
class FriendFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Keep track of combinations we've already used
        static $usedPairs = [];
        // Set a limit to prevent infinite loops
        $attempts = 0;
        $maxAttempts = 100;

        do {
            // Get two different random users
            $user1 = User::inRandomOrder()->first();
            $user2 = User::where('id', '!=', $user1->id)
                ->inRandomOrder()
                ->first();

            // Create a unique key for this pair
            $pairKey = $user1->id . '-' . $user2->id;
            $pairKey2 = $user2->id . '-' . $user1->id;

            // Check if we've used this pair before
            $isDuplicate = isset($usedPairs[$pairKey]);
            $isDuplicate2 = isset($usedPairs[$pairKey2]);

            $attempts++;

            // If we've tried too many times, throw an exception
            if ($attempts > $maxAttempts) {
                throw new \Exception("Unable to generate unique friendship pair after $maxAttempts attempts");
            }
        } while ($isDuplicate || $isDuplicate2);

        // Mark this pair as used
        $usedPairs[$pairKey] = true;

        return [
            'user_id1' => $user1->id,
            'user_id2' => $user2->id,
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }
}
