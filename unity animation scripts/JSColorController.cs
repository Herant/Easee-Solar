using UnityEngine;

public class JSColorController : MonoBehaviour
{
    [SerializeField] public Material tesla;
    [SerializeField] public Material charger;

    public void TeslaColor(string jsonString)
    {
        var color = JsonUtility.FromJson<UserColor>(jsonString);
        tesla.color = new Color32(color.r, color.g, color.b, color.a);
    }

    public void ChargerColor(string jsonString)
    {
        var color = JsonUtility.FromJson<UserColor>(jsonString);
        charger.color = new Color32(color.r, color.g, color.b, color.a);
    }

    // Blocking Keyboard input in WebGL
    void Awake()
    {
    #if !UNITY_EDITOR && UNITY_WEBGL
    WebGLInput.captureAllKeyboardInput = false;
    #endif
    }
}

public class UserColor
{
    public byte r;
    public byte g;
    public byte b;
    public byte a;
}