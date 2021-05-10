using UnityEngine;

public class SpriteColorController : MonoBehaviour
{
    void CirclePathColor(string jsonString)
    {
        var color = JsonUtility.FromJson<UserColor>(jsonString);
        foreach (SpriteRenderer sprite in GetComponentsInChildren<SpriteRenderer>())
        {
            sprite.color = new Color32(color.r, color.g, color.b, color.a);
        }
    }
}
